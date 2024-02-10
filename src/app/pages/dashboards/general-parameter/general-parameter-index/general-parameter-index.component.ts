import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from '../../../../general/general.module';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterFormComponent } from '../general-parameter-form/general-parameter-form.component'
import { GeneralParameterService } from '../../../../generic/general.service';
import { DatatableParameter } from '../../../../admin/datatable.parameters';
import { Generic } from '../../../../generic/generic.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-general-parameter-index',
  standalone: false,
  templateUrl: './general-parameter-index.component.html',
  styleUrl: './general-parameter-index.component.css'
})
export class GeneralParameterIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado ";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  serviceName: string = "";
  titleData: string = "";
  modulo: string = "";
  iconModule: string = "";
  iconForm: string = "";
  listParameterGeneral = signal<Generic[]>([]);

  constructor(
    private service: GeneralParameterService,
    private routeActual: ActivatedRoute,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.routeActual.data.subscribe(l => {
      this.title = `Listado de ${l['ruta']}`;
      this.serviceName = l['titulo']
      this.titleData = l['titulo']
      this.modulo = l['modulo']
      this.iconModule = l['iconModule']
      this.iconForm = l['iconForm']
    });

    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: this.modulo, icon: this.iconModule }, { name: this.serviceName, icon: this.iconForm }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  public nuevo() {
    let modal = this.modalService.open(GeneralParameterFormComponent, { size: 'md', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.titleData = this.titleData;
    modal.componentInstance.serviceName = this.serviceName;
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listParameterGeneral = signal<Generic[]>([]);
    this.cargarLista();
  }

  cargarLista() {
    this.getData().then((datos) => {
      datos.data.forEach((item: any) => {
        this.listParameterGeneral.update(listParameterGeneral => {
          const Generic: Generic = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre,
          };

          return [...listParameterGeneral, Generic];
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
      this.service.datatable(this.serviceName, data).subscribe(
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
    let modal = this.modalService.open(GeneralParameterFormComponent, { size: 'md', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.serviceName = this.serviceName;
    modal.componentInstance.titleData = this.titleData;
    modal.componentInstance.id = id;
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete(this.serviceName, id).subscribe(
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
    GeneralParameterIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class GeneralParameterIndexModule { }