import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RolesFormulariosComponent } from '../../roles-formularios/roles-formularios.component';

@Component({
  selector: 'app-roles-form',
  standalone: false,
  templateUrl: './roles-form.component.html',
  styleUrl: './roles-form.component.css'
})
export class RolesFormComponent implements OnInit {
  frmRoles: FormGroup;
  statusForm: boolean = true;
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  title = 'Crear Rol';
  breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Seguridad', icon: 'fa-duotone fa-lock' }, { name: 'Roles', icon: "fa-duotone fa-user-tag" }, { name: 'Crear', icon: "fa-duotone fa-octagon-plus" }];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
  ) {
    this.frmRoles = new FormGroup({
      Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Activo: new FormControl(true, Validators.required)
    });
    this.routerActive.params.subscribe((l) => (this.id = l['id']));
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.title = 'Editar Rol';
      this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Seguridad', icon: 'fa-duotone fa-lock' }, { name: 'Roles', icon: "fa-duotone fa-user-tag" }, { name: 'Editar', icon: "fa-duotone fa-pen-to-square" }];
      this.service.getById("Rol", this.id).subscribe((l) => {
        this.frmRoles.controls['Codigo'].setValue(l.data.codigo);
        this.frmRoles.controls['Nombre'].setValue(l.data.nombre);
        this.frmRoles.controls['Activo'].setValue(l.data.activo);
      });
    }
  }

  save() {
    if (this.frmRoles.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmRoles.value,
    };
    this.service.save("Rol", this.id, data).subscribe(
      (response) => {
        if (response.status) {
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
          this.helperService.redirectApp(`dashboard/seguridad/roles/editar/${response.data.id}`);
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.ERROR, error.error.message);
      }
    );
  }

  cancel() {
    this.helperService.redirectApp('dashboard/seguridad/roles');
  }
}

@NgModule({
  declarations: [
    RolesFormComponent,
    RolesFormulariosComponent
  ],
  imports: [
    CommonModule,
    GeneralModule,
    NgbNavModule
  ],
})
export class RolesFormModule { }