import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientesImportComponent } from '../clientes-import/clientes-import.component';

@Component({
  selector: 'app-clientes-index',
  standalone: false,
  templateUrl: './clientes-index.component.html',
  styleUrl: './clientes-index.component.css',
})
export class ClientesIndexComponent implements OnInit {
  title = 'Listado de Clientes';
  breadcrumb!: any[];
  botones: String[] = ['btn-importar-cliente', 'btn-nuevo'];
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(
    private service: GeneralParameterService,
    public helperService: HelperService,
    private modalService: NgbModal,
  ) {
    this.breadcrumb = [
      { name: `Inicio`, icon: `fa-duotone fa-house` },
      { name: 'Parametros', icon: 'fa-duotone fa-gears' },
      { name: 'Clientes', icon: 'fa-duotone fa-user' },
    ];
  }

  ngOnInit(): void {
    this.cargarLista();
  }

  ngAfterViewInit() {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarLista() {
    this.dtOptions = {
      dom: 'Blfrtip',
      processing: true,
      ordering: true,
      responsive: true,
      paging: true,
      order: [0, 'desc'],
      language: LANGUAGE_DATATABLE,
      ajax: (dataTablesParameters: any, callback: any) => {
        var data = new DatatableParameter();
        data.pageNumber = '';
        data.pageSize = '';
        data.filter = '';
        data.columnOrder = '';
        data.directionOrder = '';
        this.service.datatable('Cliente', data).subscribe((res) => {
          callback({
            recordsTotal: res.data.length,
            recordsFiltered: res.data.length,
            draw: dataTablesParameters.draw,
            data: res.data,
          });
        });
      },
      columns: [
        {
          title: 'TIPO CLIENTE',
          data: 'tipoCliente',
          className: 'text-center',
        },
        {
          title: 'CLIENTE',
          data: 'persona',
          className: 'text-center',
        },
        {
          title: 'RH',
          data: 'rh',
          className: 'text-center',
        },
        {
          title: 'EMPRESA',
          data: 'empresa',
          className: 'text-center',
        },
        {
          title: 'CARGO',
          data: 'cargoActual',
          className: 'text-center',
        },
        {
          title: 'ARL',
          data: 'arl',
          className: 'text-center',
        },
        {
          title: 'ENFERMEDADES',
          data: 'enfermedades',
          className: 'text-center',
        },
        {
          title: 'ALERGIAS',
          data: 'alergias',
          className: 'text-center',
        },
        {
          title: 'MEDICAMENTOS',
          data: 'medicamentos',
          className: 'text-center',
        },
        {
          title: 'LESIONES',
          data: 'lesiones',
          className: 'text-center',
        },
        {
          title: 'ACUDIENTE',
          data: 'acudiente',
          className: 'text-center',
        },
        {
          title: 'ACCIONES',
          orderable: false,
          data: 'id',
          className: 'text-center',
          render: function (id: any) {
            return `<div role="group"  class="button-group " aria-label="Basic example">
                          <button type="button" title="Editar" class="btn btn-sm text-secondary btn-dropdown-modificar" data-id="${id}"><i class="fa-duotone fa-pen-to-square" data-id="${id}"></i> Editar</button>
                          <button type="button" title="Eliminar" class="btn btn-sm text-secondary btn-dropdown-eliminar" data-id="${id}"><i class="fa-duotone fa-trash-can" data-id="${id}"></i> Eliminar</button>
                        </div>`;
          },
        },
      ],
      drawCallback: () => {
        $('.btn-dropdown-modificar')
          .off()
          .on('click', (event: any) => {
            this.update(event.currentTarget.dataset.id);
          });

        $('.btn-dropdown-eliminar')
          .off()
          .on('click', (event: any) => {
            this.deleteGeneric(event.currentTarget.dataset.id);
          });
      },
    };
  }

  refrescarTabla() {
    if (typeof this.dtElement.dtInstance != 'undefined') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
      });
    }
  }

  nuevo() {
    this.helperService.redirectApp('dashboard/parametros/clientes/crear');
  }

  update(id: any) {
    this.helperService.redirectApp(`dashboard/parametros/clientes/editar/${id}`);
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete('Cliente', id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(
              MessageType.SUCCESS,
              Messages.DELETESUCCESS
            );
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(
            MessageType.WARNING,
            error
          );
        }
      );
    });
  }

  importarDatos(){
    let modal = this.modalService.open(ClientesImportComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });
    modal.result.then(res => {
      if (res) {
        this.refrescarTabla();
      }
    })
  }
}

@NgModule({
  declarations: [ClientesIndexComponent],
  imports: [CommonModule, GeneralModule],
})
export class ClientesIndexModule { }
