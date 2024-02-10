import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { ModulosFormComponent } from '../modulos-form/modulos-form.component'
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Modulo } from '../modulos.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-modulos-index',
  standalone: false,
  templateUrl: './modulos-index.component.html',
  styleUrl: './modulos-index.component.css'
})
export class ModulosIndexComponent implements OnInit {
  title = "Listado de Modulos";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listModulos = signal<Modulo[]>([]);

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Seguridad", icon: "fa-duotone fa-lock" }, { name: "Modulo", icon: "fa-duotone fa-folder-tree" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  nuevo() {
    let modal = this.modalService.open(ModulosFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.titleData = "Modulo";
    modal.componentInstance.serviceName = "Modulo";
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listModulos = signal<Modulo[]>([]);
    this.cargarLista();
  }

  cargarLista() {
    this.getData()
      .then((datos) => {
        datos.data.forEach((item: any) => {
          this.listModulos.update(listModulos => {
            const Modulo: Modulo = {
              id: item.id,
              icono: item.icono,
              activo: item.activo,
              codigo: item.codigo,
              nombre: item.nombre,
            };

            return [...listModulos, Modulo];
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
      this.service.datatable("Modulo", data).subscribe(
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
    let modal = this.modalService.open(ModulosFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered:true });

    modal.componentInstance.titleData = "Modulo";
    modal.componentInstance.serviceName = "Modulo";
    modal.componentInstance.id = id;

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Modulo", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.ERROR, error.error.message);
        }
      )
    });
  }
}

@NgModule({
  declarations: [
    ModulosIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class ModulosIndexModule { }