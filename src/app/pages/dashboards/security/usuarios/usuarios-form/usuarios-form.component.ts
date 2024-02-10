import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DataSelectDto } from '../../../../../generic/dataSelectDto';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosRolesComponent } from '../../usuarios-roles/usuarios-roles.component'

@Component({
  selector: 'app-usuarios-form',
  standalone: false,
  templateUrl: './usuarios-form.component.html',
  styleUrl: './usuarios-form.component.css'
})
export class UsuariosFormComponent implements OnInit {
  frmUsuarios: FormGroup;
  statusForm: boolean = true;
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  title = 'Crear Usuario';
  listPersonas = signal<DataSelectDto[]>([]);
  breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Seguridad', icon: 'fa-duotone fa-lock' }, { name: 'Usuario', icon: "fa-duotone fa-user-gear" }, { name: 'Crear', icon: "fa-duotone fa-user-plus" }];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
  ) {
    this.frmUsuarios = new FormGroup({
      UserName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      Password: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      Activo: new FormControl(true, Validators.required),
      PersonaId: new FormControl(null, Validators.required),
    });
    this.routerActive.params.subscribe((l) => (this.id = l['id']));
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.title = 'Editar Usuario';
      this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Seguridad', icon: 'fa-duotone fa-lock' }, { name: 'Usuario', icon: "fa-duotone fa-user-gear" }, { name: 'Editar', icon: "fa-duotone fa-pen-to-square" }];
      this.service.getById("Usuario", this.id).subscribe((l) => {
        this.frmUsuarios.controls['UserName'].setValue(l.data.userName);
        this.frmUsuarios.controls['Activo'].setValue(l.data.activo);
        this.frmUsuarios.controls['PersonaId'].setValue(l.data.personaId);
      });
    }
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.service.getAll('Persona').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listPersonas.update(listPersonas => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.tipoDocumento} - ${item.primerNombre} ${item.primerApellido}`,
            activo: item.activo
          };

          return [...listPersonas, DataSelectDto];
        });
      });
    });
  }

  save() {
    if (this.frmUsuarios.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmUsuarios.value,
    };
    this.service.save("Usuario", this.id, data).subscribe(
      (response) => {
        if (response.status) {
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
          this.helperService.redirectApp(`dashboard/seguridad/usuarios/editar/${response.data.id}`);
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.WARNING, error);
      }
    );
  }

  cancel() {
    this.helperService.redirectApp('dashboard/seguridad/usuarios');
  }
}

@NgModule({
  declarations: [
    UsuariosFormComponent,
    UsuariosRolesComponent
  ],
  imports: [
    CommonModule,
    GeneralModule,
    NgbNavModule
  ],
})
export class UsuariosFormModule { }