import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Empleado } from '../empleados.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
  selector: 'app-empleados-index',
  standalone: false,
  templateUrl: './empleados-index.component.html',
  styleUrl: './empleados-index.component.css'
})
export class EmpleadosIndexComponent implements OnInit {
  title = "Listado de Empleados";
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  listEmpleados = signal<Empleado[]>([]);

  constructor(
    private service: GeneralParameterService,
    public helperService: HelperService
  ) {
    this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Parametros ", icon: "fa-duotone fa-gears" }, { name: "Empleados", icon: "fa-duotone fa-user-tie" }];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.getData()
      .then((datos) => {
        datos.data.forEach((item: any) => {
          this.listEmpleados.update(listEmpleados => {
            const Empleado: Empleado = {
              id: item.id,
              activo: item.activo,
              codigo: item.codigo,
              personaId: item.personaId,
              persona: item.persona,
              empresaId: item.empresaId,
              empresa: item.empresa,
              cargoId: item.cargoId,
              cargo: item.cargo,
            };

            return [...listEmpleados, Empleado];
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
      this.service.datatable("Empleado", data).subscribe(
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
    this.listEmpleados = signal<Empleado[]>([]);
    this.cargarLista();
  }

  nuevo() {
    this.helperService.redirectApp("dashboard/parametros/empleados/crear");
  }

  update(id: any) {
    this.helperService.redirectApp(`dashboard/parametros/empleados/editar/${id}`);
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("Empleado", id).subscribe(
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
}
@NgModule({
  declarations: [
    EmpleadosIndexComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ]
})
export class EmpleadosIndexModule { }