import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from '../../../../../general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ConveniosFormComponent } from '../convenios-form/convenios-form.component'
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Convenio } from '../convenios.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-convenios-index',
  standalone: false,
  templateUrl: './convenios-index.component.html',
  styleUrl: './convenios-index.component.css'
})
export class ConveniosIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado de convenios";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listConvenios = signal<Convenio[]>([]);

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Parametros ", icon: "fa-duotone fa-gears" }, { name: "Convenios", icon: "fa-duotone fa-handshake" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  public nuevo() {
    let modal = this.modalService.open(ConveniosFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.titleData = "Convenio";
    modal.componentInstance.serviceName = "Convenio";
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listConvenios = signal<Convenio[]>([]);
    this.cargarLista();
  }

  cargarLista() {
    this.getData().then((datos) => {
      datos.data.forEach((item: any) => {
        this.listConvenios.update(listConvenios => {
          const Convenio: Convenio = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre,
            valor: item.valor,
            fechaInicio: item.fechaInicio,
            fechaFin: item.fechaFin,
          };

          return [...listConvenios, Convenio];
        });
      });

      setTimeout(() => {
        $("#datatable").DataTable({
          destroy: true,
          language: LANGUAGE_DATATABLE,
          processing: true,
          dom: 'Blfrtip'
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
      this.service.datatable("Convenio", data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      )
    });
  }

  updateGeneric(id: any) {
    let modal = this.modalService.open(ConveniosFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.serviceName = "Convenio";
    modal.componentInstance.titleData = "Convenio";
    modal.componentInstance.id = id;
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Convenio", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.WARNING, error.error.message);
        }
      )
    });
  }
}

@NgModule({
  declarations: [
    ConveniosIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class ConveniosIndexModule { }