import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ContingenciasFormComponent } from '../contingencias-form/contingencias-form.component'
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Contingencia } from '../contingencias.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-contingencias-index',
  standalone: false,
  templateUrl: './contingencias-index.component.html',
  styleUrl: './contingencias-index.component.css'
})
export class ContingenciasIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado de Contingencias";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listContingencias = signal<Contingencia[]>([]);

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-shop" }, { name: "Contingencia", icon: "fa-duotone fa-triangle-exclamation" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.getData().then((datos) => {
      datos.data.forEach((item: any) => {
        this.listContingencias.update(listContingencias => {
          const Contingencia: Contingencia = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre,
            norma: item.norma,
            porcentajeAforo: item.porcentajeAforo,
          };

          return [...listContingencias, Contingencia];
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
      this.service.datatable("Contingencia", data).subscribe(
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
    this.listContingencias = signal<Contingencia[]>([]);
    this.cargarLista();
  }

  nuevo() {
    let modal = this.modalService.open(ContingenciasFormComponent, { size: 'lg', keyboard: false, backdrop: true, centered: true });

    modal.componentInstance.titleData = "Contingencia";
    modal.componentInstance.serviceName = "Contingencia";

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  updateGeneric(id: any) {
    let modal = this.modalService.open(ContingenciasFormComponent, { size: 'lg', keyboard: false, backdrop: true, centered: true });

    modal.componentInstance.titleData = "Contingencia";
    modal.componentInstance.serviceName = "Contingencia";
    modal.componentInstance.id = id;

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Contingencia", id).subscribe(
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
    ContingenciasIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class ContingenciasIndexModule { }