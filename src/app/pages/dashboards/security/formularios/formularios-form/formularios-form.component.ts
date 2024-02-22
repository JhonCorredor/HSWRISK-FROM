import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';

@Component({
  selector: 'app-formularios-form',
  standalone: false,
  templateUrl: './formularios-form.component.html',
  styleUrl: './formularios-form.component.css'
})
export class FormulariosFormComponent implements OnInit {
  frmFormularios: FormGroup;
  statusForm: boolean = true
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  titulo = "";
  serviceName: String = '';
  titleData: String = '';
  key: string = "";
  public lista: any[] = [];
  public listIcons: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalActive: NgbActiveModal
  ) {
    this.frmFormularios = new FormGroup({
      Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Url: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      Icono: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true, Validators.required),
      Key_Id: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.titulo = `Editar ${this.titleData}`;
      this.service.getById(this.serviceName, this.id).subscribe(l => {
        this.frmFormularios.controls['Codigo'].setValue(l.data.codigo);
        this.frmFormularios.controls['Nombre'].setValue(l.data.nombre);
        this.frmFormularios.controls['Url'].setValue(l.data.url);
        this.frmFormularios.controls['Activo'].setValue(l.data.activo);
        var keyId = this.toCamelCase(this.key);
        this.frmFormularios.controls['Key_Id'].setValue(
          l.data[keyId + 'Id']
        );
        let id = this.listIcons.findIndex((element: any) => element.textoMostrar == l.data.icono)
        const iconoHtml: any = document.getElementById('icon' + id)
        iconoHtml.style.backgroundColor = "gray";
        this.frmFormularios.controls['Icono'].setValue(l.data.icono);
      })
    } else {
      this.titulo = `Crear ${this.titleData}`;
    }

    this.cargarListaForeingKey();

    this.listIcons = [
      { textoMostrar: "fa-duotone fa-user", name: "user" },
      { textoMostrar: "fa-duotone fa-window-maximize", name: "window" },
      { textoMostrar: "fa-duotone fa-folder-tree", name: "folder-tree" },
      { textoMostrar: "fa-duotone fa-user-tag", name: "user-tag" },
      { textoMostrar: "fa-duotone fa-folder-open", name: "folder-open" },
      { textoMostrar: "fa-duotone fa-building-columns", name: "bank" },
      { textoMostrar: "fa-duotone fa-users-gear", name: "users-gear" },
      { textoMostrar: "fa-duotone fa-vest", name: "vest" },
      { textoMostrar: "fa-duotone fa-shirt", name: "shirt" },
      { textoMostrar: "fa-duotone fa-scissors", name: "scissors" },
      { textoMostrar: "fa-duotone fa-city", name: "city" },
      { textoMostrar: "fa-duotone fa-map-location-dot", name: "map-location-dot" },
      { textoMostrar: "fa-duotone fa-sliders", name: "sliders" },
      { textoMostrar: "fa-duotone fa-bars", name: "bars" },
      { textoMostrar: "fa-duotone fa-money-bills", name: "money-bills" },
      { textoMostrar: "fa-duotone fa-earth-americas", name: "country" },
      { textoMostrar: "fa-duotone fa-pen-ruler", name: "pen-ruler" },
      { textoMostrar: "fa-duotone fa-briefcase", name: "briefcase" },
      { textoMostrar: "fa-duotone fa-user-gear", name: "user-gear" },
      { textoMostrar: "fa-duotone fa-people-carry-box", name: "carry-box" },
      { textoMostrar: "fa-duotone fa-user-tie", name: "user-tie" },
      { textoMostrar: "fa-duotone fa-warehouse", name: "warehouse" },
      { textoMostrar: "fa-duotone fa-dollar-sign", name: "dollar" },
      { textoMostrar: "fa-duotone fa-money-bill-transfer", name: "money-bill" },
      { textoMostrar: "fa-duotone fa-ruler-vertical", name: "ruler" },
      { textoMostrar: "fa-duotone fa-file-invoice-dollar", name: "invoice-dollar" },
      { textoMostrar: "fa-duotone fa-cart-flatbed-boxes", name: "flatbed-boxes" },
      { textoMostrar: "fa-duotone fa-shop-lock", name: "shop-lock" },
      { textoMostrar: "fa-duotone fa-file-invoice", name: "file-invoice" },
      { textoMostrar: "fa-duotone fa-cash-register", name: "cash-register" },
      { textoMostrar: "fa-duotone fa-cart-shopping", name: "cart-shopping" },
      { textoMostrar: "fa-duotone fa-hat-cowboy", name: "hat-cowboy" },
      { textoMostrar: "fa-duotone fa-list-ol", name: "numeracion" },
      { textoMostrar: "fa-duotone fa-gear", name: "configuracion" },
      { textoMostrar: "fa-duotone fa-user-helmet-safety", name: "arl" },
      { textoMostrar: "fa-duotone fa-user-clock", name: "jornada" },
      { textoMostrar: "fa-duotone fa-layer-group", name: "nivel" },
      { textoMostrar: "fa-duotone fa-screen-users", name: "salon" },
      { textoMostrar: "fa-duotone fa-triangle-exclamation", name: "contingencia" },
      { textoMostrar: "fa-duotone fa-person-chalkboard", name: "curso" },
      { textoMostrar: "fa-duotone fa-clipboard-check", name: "inscripcion" },
    ]
  }

  cargarListaForeingKey() {
    this.service.getAll(this.key).subscribe((r) => {
      this.lista = r.data;
    });
  }

  save() {
    if (this.frmFormularios.invalid) {
      this.statusForm = false
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      [this.key + 'Id']: this.frmFormularios.controls['Key_Id'].value,
      ...this.frmFormularios.value,
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
        this.helperService.showMessage(MessageType.ERROR, error);
      }
    )
  }

  cancel() {
    this.modalActive.close();
  }

  toCamelCase(input: string): string {
    return input.replace(/^[A-Z]/, (match) => match.toLowerCase());
  }

  iconoSelect(icon: number, card: any) {
    this.frmFormularios.controls['Icono'].setValue(this.listIcons[icon].textoMostrar);

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
    FormulariosFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule
  ]
})
export class FormulariosFormModule { }