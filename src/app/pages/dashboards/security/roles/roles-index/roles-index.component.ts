import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Rol } from '../roles.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';


@Component({
  selector: 'app-roles-index',
  standalone: false,
  templateUrl: './roles-index.component.html',
  styleUrl: './roles-index.component.css'
})
export class RolesIndexComponent implements OnInit {
  title = "Listado de Roles";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listRoles = signal<Rol[]>([]);

  constructor(
    private service: GeneralParameterService,
    private helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Seguridad", icon: "fa-duotone fa-lock" }, { name: "Roles", icon: "fa-duotone fa-user-tag" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.getData()
    .then((datos) => {
      datos.data.forEach((item: any) => {
        this.listRoles.update(listRoles => {
          const Rol: Rol = {
            id: item.id,
            activo: item.activo,
            codigo: item.codigo,
            nombre: item.nombre
          };

          return [...listRoles, Rol];
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
      this.service.datatable("Rol", data).subscribe(
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
    this.listRoles = signal<Rol[]>([]);
    this.cargarLista();
  }

  nuevo() {
    this.helperService.redirectApp("dashboard/seguridad/roles/crear");
  }

  update(id: any) {
    this.helperService.redirectApp(`dashboard/seguridad/roles/editar/${id}`);
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Rol", id).subscribe(
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
    RolesIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class RolesIndexModule { }