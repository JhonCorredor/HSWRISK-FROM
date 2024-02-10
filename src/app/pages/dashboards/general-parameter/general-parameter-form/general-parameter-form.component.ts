import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../generic/general.service';

@Component({
  selector: 'app-general-parameter-form',
  standalone: false,
  templateUrl: './general-parameter-form.component.html',
  styleUrl: './general-parameter-form.component.css'
})
export class GeneralParameterFormComponent implements OnInit {
  frmGeneral: FormGroup;
  statusForm: boolean = true
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  serviceName: String = '';
  titleData: String = '';

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal
  ) {
    this.frmGeneral = new FormGroup({
      Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Activo: new FormControl(true, Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe(l => {
        this.frmGeneral.controls['Codigo'].setValue(l.data.codigo);
        this.frmGeneral.controls['Nombre'].setValue(l.data.nombre);
        this.frmGeneral.controls['Activo'].setValue(l.data.activo);
      })
    } else {
      this.titulo = `Crear ${this.titleData}`;
    }
  }

  save() {
    if (this.frmGeneral.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmGeneral.value
    };
    this.service.save(this.serviceName, this.id, data).subscribe(
      (response) => {
        if (response.status) {
          this.modalActive.close(true);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.WARNING, error.error.message);
      }
    )
  }

  cancel() {
    this.modalActive.close();
  }
}

@NgModule({
  declarations: [
    GeneralParameterFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule
  ]
})
export class GeneralParameterFormModule { }