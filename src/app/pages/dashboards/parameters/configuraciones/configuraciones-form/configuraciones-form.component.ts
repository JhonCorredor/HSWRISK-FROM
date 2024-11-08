import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuraciones-form',
  standalone: false,
  templateUrl: './configuraciones-form.component.html',
  styleUrl: './configuraciones-form.component.css'
})
export class ConfiguracionesFormComponent implements OnInit {
  img = '../../../../../../assets/no-photo.jpg';
  imgRepresentante = '../../../../../../assets/no-photo.jpg';
  imageLogo1 = '../../../../../../assets/no-photo.jpg';
  imageLogo2 = '../../../../../../assets/no-photo.jpg';
  imgCertificacion = '../../../../../../assets/no-photo.jpg';
  dataArchivo: any = undefined;
  frmConfiguracion: FormGroup;
  statusForm: boolean = true;
  id!: number;
  botones = ['btn-guardar'];
  title = 'Configuración general';
  breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Parametros', icon: 'fa-duotone fa-gears' }, { name: 'Configuración General', icon: 'fa-duotone fa-gear' }];
  public listaTamano: any[] = [{ valor: 80 }];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService
  ) {
    this.frmConfiguracion = new FormGroup({
      Licencia: new FormControl("", [Validators.required]),
      Aprobacion: new FormControl("", [Validators.required]),
      Certificacion: new FormControl("", [Validators.required]),
      Acreditacion: new FormControl("", [Validators.required]),
      ManejaClaveSupervisor: new FormControl(false, [Validators.required]),
      ClaveSupervisor: new FormControl(null, [Validators.required]),
      NombreRepresentante: new FormControl(null, [Validators.required]),
      Arl: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true, Validators.required),
      ContentBackground: new FormControl(""),
      ContentFirmaRepresentante: new FormControl(""),
      ContentLogo1: new FormControl(""),
      ContentLogo2: new FormControl(""),
      ContentCertificacion: new FormControl(""),
    });
    this.routerActive.params.subscribe((l) => (this.id = l['id']));
  }

  ngOnInit(): void {
    if (this.id != undefined && this.id != null) {
      this.helperService.showLoading();
      this.service.getById('Configuracion', this.id).subscribe((l) => {
        this.frmConfiguracion.controls['Licencia'].setValue(l.data.licencia);
        this.frmConfiguracion.controls['Aprobacion'].setValue(l.data.aprobacion);
        this.frmConfiguracion.controls['Certificacion'].setValue(l.data.certificacion);
        this.frmConfiguracion.controls['Acreditacion'].setValue(l.data.acreditacion);
        this.frmConfiguracion.controls['ManejaClaveSupervisor'].setValue(l.data.manejaClaveSupervisor);
        this.frmConfiguracion.controls['ClaveSupervisor'].setValue(l.data.claveSupervisor);
        this.frmConfiguracion.controls['NombreRepresentante'].setValue(l.data.nombreRepresentante);
        this.frmConfiguracion.controls['Arl'].setValue(l.data.arl);
        this.frmConfiguracion.controls['Activo'].setValue(l.data.activo);

        //Consulto el archivo
        this.service.getByTablaId('Archivo', this.id, "Configuraciones").subscribe((response) => {
          if (response.data.length > 0) {
            response.data.forEach((item: any) => {
              if (item.nombre == 'BackgroundImageCertificate') {
                this.img = item.content;
              }
            });
          }
        });

        this.service.getByTablaId('Archivo', this.id, "Configuraciones").subscribe((response) => {
          if (response.data.length > 0) {
            response.data.forEach((item: any) => {
              if (item.nombre == 'FirmaRepresentante') {
                this.imgRepresentante = item.content;
              }
            });
          }
        });

        this.service.getByTablaId('Archivo', this.id, "Configuraciones").subscribe((response) => {
          if (response.data.length > 0) {
            response.data.forEach((item: any) => {
              if (item.nombre == 'Logo1') {
                this.imageLogo1 = item.content;
              }
            });
          }
        });

        this.service.getByTablaId('Archivo', this.id, "Configuraciones").subscribe((response) => {
          if (response.data.length > 0) {
            response.data.forEach((item: any) => {
              if (item.nombre == 'Logo2') {
                this.imageLogo2 = item.content;
              }
            });
          }
        });

        this.service.getByTablaId('Archivo', this.id, "Configuraciones").subscribe((response) => {
          if (response.data.length > 0) {
            response.data.forEach((item: any) => {
              if (item.nombre == 'Certificacion') {
                this.imgCertificacion = item.content;
              }
            });
          }
          setTimeout(() => {
            this.helperService.hideLoading();
          }, 200);
        });
      });
    }
  }

  save() {
    if (this.frmConfiguracion.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    this.frmConfiguracion.controls["ClaveSupervisor"].setValue(this.frmConfiguracion.controls["ClaveSupervisor"].value.toString());
    let data = {
      id: this.id ?? 0,
      ...this.frmConfiguracion.value,
    };
    this.helperService.showLoading();
    this.service.save('Configuracion', this.id, data).subscribe(
      (response) => {
        if (response.status) {
          setTimeout(() => {
            this.helperService.hideLoading();
          }, 200);
          this.helperService.showMessage(
            MessageType.SUCCESS,
            "Ajustes guardados"
          );
        } else {
          setTimeout(() => {
            this.helperService.hideLoading();
          }, 200);
        }
      },
      (error) => {
        setTimeout(() => {
          this.helperService.hideLoading();
        }, 200);
        this.helperService.showMessage(MessageType.ERROR, error);
      }
    );
  }

  fileEvent(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    if (type == 'png' || type == 'jpeg' || type == 'jpg') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.frmConfiguracion.controls["ContentBackground"].setValue(archivo);
        this.img = archivo;
      };
    }
  }

  fileEventRepresentante(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    if (type == 'png') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.frmConfiguracion.controls["ContentFirmaRepresentante"].setValue(archivo);
        this.imgRepresentante = archivo;
      };
    } else {
      this.helperService.showMessage(MessageType.WARNING, "La firma no esta en formato png");
    }
  }

  fileEventLogo1(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    if (type == 'png') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.frmConfiguracion.controls["ContentLogo1"].setValue(archivo);
        this.imageLogo1 = archivo;
      };
    }
  }

  fileEventLogo2(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    if (type == 'png') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.frmConfiguracion.controls["ContentLogo2"].setValue(archivo);
        this.imageLogo2 = archivo;
      };
    }
  }

  fileEventCertificacion(event: any) {
    let archivo: any;
    let type = event.target.files[0].type.split('/')[1];
    if (type == 'png') {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = async (e: any) => {
        archivo = await e.target.result; //imagen en base 64
        this.frmConfiguracion.controls["ContentCertificacion"].setValue(archivo);
        this.imgCertificacion = archivo;
      };
    }
  }
}
@NgModule({
  declarations: [
    ConfiguracionesFormComponent
  ],
  imports: [
    CommonModule,
    GeneralModule,
    NgbAccordionModule
  ],
})
export class ConfiguracionesFormModule { }