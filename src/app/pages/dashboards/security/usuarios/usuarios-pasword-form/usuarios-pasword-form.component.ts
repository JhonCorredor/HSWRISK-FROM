import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { UsuariosService } from '../../../../../account/usuarios.service';
import { GeneralParameterService } from '../../../../../generic/general.service';

@Component({
  selector: 'app-usuarios-pasword-form',
  standalone: false,
  templateUrl: './usuarios-pasword-form.component.html',
  styleUrl: './usuarios-pasword-form.component.css'
})
export class UsuariosPaswordFormComponent implements OnInit {
  frmUsuarios: FormGroup;
  statusForm: boolean = true
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";

  constructor(
    public routerActive: ActivatedRoute,
    private service: UsuariosService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal,
    private generalService: GeneralParameterService
  ) {
    this.frmUsuarios = new FormGroup({
      Usuario: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Password: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      PasswordRepeat: new FormControl(null, [Validators.required, Validators.maxLength(200)])
    });
  }

  ngOnInit(): void {
    this.titulo = "Cambiar Contraseña";
    this.generalService.getById("Usuario", this.id).subscribe(l => {
      this.frmUsuarios.controls['Usuario'].setValue(l.data.userName);
    })
  }

  save() {
    if (this.frmUsuarios.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    if (this.frmUsuarios.controls['Password'].value === this.frmUsuarios.controls['PasswordRepeat'].value) {
      let data = {
        id: this.id ?? 0,
        ...this.frmUsuarios.value
      };
      this.service.UpdatePassword(this.id, data).subscribe(
        (response) => {
          if (response.status) {
            this.modalActive.close(true);
            this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
          }
        },
        (error) => {
          this.modalActive.close();
          this.helperService.showMessage(MessageType.WARNING, error.error.message);
        }
      )
    } else {
      this.helperService.showMessage(MessageType.WARNING, Messages.INVALIDPASSWORD);
    }
  }

  cancel() {
    this.modalActive.close();
  }
}

@NgModule({
  declarations: [
    UsuariosPaswordFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule
  ],
})
export class UsuariosPaswordFormModule { }