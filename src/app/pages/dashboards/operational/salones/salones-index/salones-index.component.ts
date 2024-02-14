import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { SalonesFormComponent } from '../salones-form/salones-form.component'
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Salon } from '../salones.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-salones-index',
  standalone: false,
  templateUrl: './salones-index.component.html',
  styleUrl: './salones-index.component.css'
})
export class SalonesIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado de Salones";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listSalones = signal<Salon[]>([]);

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-shop" }, { name: "Salon", icon: "fa-duotone fa-screen-users" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.getData().then((datos) => {
      datos.data.forEach((item: any) => {
        this.listSalones.update(listSalones => {
          const Salon: Salon = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre,
            aforo: item.aforo,
            contingenciaId: item.contingenciaId,
            contingencia: item.contingencia,
            estadoId: item.estadoId,
            estado: item.estado,
            ciudadId: item.ciudadId,
            ciudad: item.ciudad,
          };

          return [...listSalones, Salon];
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
      this.service.datatable("Salon", data).subscribe(
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
    this.listSalones = signal<Salon[]>([]);
    this.cargarLista();
  }

  nuevo() {
    let modal = this.modalService.open(SalonesFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.titleData = "Salon";
    modal.componentInstance.serviceName = "Salon";

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  updateGeneric(id: any) {
    let modal = this.modalService.open(SalonesFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.titleData = "Salon";
    modal.componentInstance.serviceName = "Salon";
    modal.componentInstance.id = id;

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Salon", id).subscribe(
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
    SalonesIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class SalonesIndexModule { }