import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';

@Component({
  selector: 'app-modulos-form',
  standalone: false,
  templateUrl: './modulos-form.component.html',
  styleUrl: './modulos-form.component.css'
})
export class ModulosFormComponent implements OnInit {
  frmModulo: FormGroup;
  statusForm: boolean = true
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  serviceName: String = '';
  titleData: String = '';
  public listIcons: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal
  ) {
    this.frmModulo = new FormGroup({
      Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Activo: new FormControl(true, Validators.required),
      Icono: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe(l => {
        this.frmModulo.controls['Codigo'].setValue(l.data.codigo);
        this.frmModulo.controls['Nombre'].setValue(l.data.nombre);
        this.frmModulo.controls['Activo'].setValue(l.data.activo);

        let id = this.listIcons.findIndex((element: any) => element.textoMostrar == l.data.icono)
        const iconoHtml: any = document.getElementById('icon' + id)
        iconoHtml.style.backgroundColor = "gray";
        this.frmModulo.controls['Icono'].setValue(l.data.icono);
      })
    } else {
      this.titulo = `Crear ${this.titleData}`;
    }

    this.listIcons = [
      { textoMostrar: "fa-duotone fa-lock", name: "security" },
      { textoMostrar: "fa-duotone fa-gears", name: "parameter" },
      { textoMostrar: "fa-duotone fa-shop", name: "operational" },
      { textoMostrar: "fa-duotone fa-boxes-stacked", name: "inventory" },
    ]
  }

  save() {
    if (this.frmModulo.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmModulo.value
    };
    this.service.save(this.serviceName, this.id, data).subscribe(
      (response) => {
        if (response.status) {
          this.modalActive.close(true);
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
        }
      },
      (error) => {
        this.modalActive.close();
        this.helperService.showMessage(MessageType.ERROR, error.error.message);
      }
    )
  }

  cancel() {
    this.modalActive.close();
  }

  iconoSelect(icon: number, card: any) {
    this.frmModulo.controls['Icono'].setValue(this.listIcons[icon].textoMostrar);

    for (let i = 0; i < this.listIcons.length; i++) {
      const iconoHtml: any = document.getElementById('icon' + i)
      iconoHtml.style.backgroundColor = "white";
    }

    const iconoHtml: any = document.getElementById('icon' + icon)
    iconoHtml.style.backgroundColor = "gray";
  }
}

@NgModule({
  declarations: [
    ModulosFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule
  ]
})
export class ModulosForModule { }