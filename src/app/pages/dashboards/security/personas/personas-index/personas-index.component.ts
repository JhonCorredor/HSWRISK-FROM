import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { PersonasFormComponent } from '../personas-form/personas-form.component'
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Persona } from '../personas.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-personas-index',
  standalone: false,
  templateUrl: './personas-index.component.html',
  styleUrl: './personas-index.component.css'
})
export class PersonasIndexComponent implements OnInit {
  API_URL: any;
  title = "Listado de Personas";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listPersonas = signal<Persona[]>([]);

  constructor(
    private service: GeneralParameterService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Seguridad", icon: "fa-duotone fa-lock" }, { name: "Personas", icon: "fa-duotone fa-user" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.getData()
    .then((datos) => {
      datos.data.forEach((item: any) => {
        this.listPersonas.update(listPersonas => {
          const Persona: Persona = {
            id: item.id,
            activo: item.activo,
            tipoDocumento: item.tipoDocumento,
            documento: item.documento,
            primerNombre: item.primerNombre,
            segundoNombre: item.segundoNombre,
            primerApellido: item.primerApellido,
            segundoApellido: item.segundoApellido,
            direccion: item.direccion,
            dateBirth: item.dateBirth,
            telefono: item.telefono,
            email: item.email,
            genero: item.genero,
            ciudad: item.ciudad,
            ciudadId: item.ciudadId,
          };

          return [...listPersonas, Persona];
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
      this.service.datatable("Persona", data).subscribe(
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
    this.listPersonas = signal<Persona[]>([]);
    this.cargarLista();
  }

  nuevo() {
    let modal = this.modalService.open(PersonasFormComponent, { size: 'lg', keyboard: false, backdrop: true });

    modal.componentInstance.titleData = "Persona";
    modal.componentInstance.serviceName = "Persona";
    modal.componentInstance.key = "Ciudad";

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  updateGeneric(id: any) {
    let modal = this.modalService.open(PersonasFormComponent, { size: 'lg', keyboard: false, backdrop: true });

    modal.componentInstance.titleData = "Persona";
    modal.componentInstance.serviceName = "Persona";
    modal.componentInstance.id = id;
    modal.componentInstance.key = "Ciudad";

    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Persona", id).subscribe(
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
    PersonasIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class PersonasIndexModule { }