import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterKeyFormComponent } from '../general-parameter-key-form/general-parameter-key-form.component'
import { GeneralParameterService } from '../../../../generic/general.service';
import { DatatableParameter } from '../../../../admin/datatable.parameters';
import { GenericKey } from '../../../../generic/genericKey.modulo';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-general-parameter-key-index',
  standalone: false,
  templateUrl: './general-parameter-key-index.component.html',
  styleUrl: './general-parameter-key-index.component.css'
})
export class GeneralParameterKeyIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado ";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  serviceName: string = "";
  titleData: string = "";
  modulo: string = "";
  iconModule: string = "";
  iconForm: string = "";
  key: string = "";
  listParameterGeneralKey = signal<GenericKey[]>([]);

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
      this.key = l['key']
    });

    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: this.modulo, icon: this.iconModule }, { name: this.serviceName, icon: this.iconForm }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listParameterGeneralKey = signal<GenericKey[]>([]);
    this.cargarLista();
  }

  cargarLista() {
    this.getData().then((datos) => {
      var foreingKeyColumn = this.toCamelCase(this.key);
      datos.data.forEach((item: any) => {
        this.listParameterGeneralKey.update(listParameterGeneralKey => {
          const GenericKey: GenericKey = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre,
            key: item[foreingKeyColumn],
          };

          return [...listParameterGeneralKey, GenericKey];
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

  nuevo() {
    let modal = this.modalService.open(GeneralParameterKeyFormComponent, { size: 'lg', keyboard: false, backdrop: true, centered: true });

    modal.componentInstance.titleData = this.titleData;
    modal.componentInstance.serviceName = this.serviceName;
    modal.componentInstance.key = this.key;
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  updateGeneric(id: any) {
    let modal = this.modalService.open(GeneralParameterKeyFormComponent, { size: 'lg', keyboard: false, backdrop: true, centered: true });

    modal.componentInstance.serviceName = this.serviceName;
    modal.componentInstance.titleData = this.titleData;
    modal.componentInstance.id = id;
    modal.componentInstance.key = this.key;
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
          this.helperService.showMessage(MessageType.WARNING, error);
        }
      )
    });
  }

  toCamelCase(input: string): string {
    return input.replace(/^[A-Z]/, (match) => match.toLowerCase());
  }
}

@NgModule({
  declarations: [
    GeneralParameterKeyIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class GeneralParameterIndexModule { }