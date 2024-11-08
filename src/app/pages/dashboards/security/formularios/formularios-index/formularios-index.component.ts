import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { FormulariosFormComponent } from '../formularios-form/formularios-form.component'
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Formulario } from '../formularios.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-formularios-index',
  standalone: false,
  templateUrl: './formularios-index.component.html',
  styleUrl: './formularios-index.component.css'
})
export class FormulariosIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado de Formularios";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listFormularios = signal<Formulario[]>([]);

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Seguridad", icon: "fa-duotone fa-lock" }, { name: "Formulario", icon: "fa-duotone fa-window-maximize" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.getData().then((datos) => {
      datos.data.forEach((item: any) => {
        this.listFormularios.update(listFormularios => {
          const Formulario: Formulario = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre,
            url: item.url,
            icono: item.icono,
            modulo: item.modulo,
            moduloId: item.moduloId,
          };

          return [...listFormularios, Formulario];
        });
      });

      setTimeout(() => {
        $("#datatable").DataTable({
          dom: 'Blfrtip',
          destroy: true,
          language: LANGUAGE_DATATABLE,
          processing: true
        });
      }, 200);
    })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }

  getData(): Promise<any> {
    var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = "";
    return new Promise((resolve, reject) => {
      this.service.datatable("Formulario", data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      )
    });
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listFormularios = signal<Formulario[]>([]);
    this.cargarLista();
  }

  nuevo() {
    let modal = this.modalService.open(FormulariosFormComponent, { size: 'lg', keyboard: false, backdrop: true, centered: true });

    modal.componentInstance.titleData = "Formulario";
    modal.componentInstance.serviceName = "Formulario";
    modal.componentInstance.key = "Modulo";

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  updateGeneric(id: any) {
    let modal = this.modalService.open(FormulariosFormComponent, { size: 'lg', keyboard: false, backdrop: true, centered: true });

    modal.componentInstance.titleData = "Formulario";
    modal.componentInstance.serviceName = "Formulario";
    modal.componentInstance.id = id;
    modal.componentInstance.key = "Modulo";

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Formulario", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.ERROR, error);
        }
      )
    });
  }
}


@NgModule({
  declarations: [
    FormulariosIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class FormulariosIndexModule { }