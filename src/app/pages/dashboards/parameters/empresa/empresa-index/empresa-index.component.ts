import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-empresa-index',
  standalone: false,
  templateUrl: './empresa-index.component.html',
  styleUrl: './empresa-index.component.css',
})
export class EmpresaIndexComponent implements OnInit {
  title = 'Listado de Empresas';
  breadcrumb!: any[];
  botones: String[] = ['btn-nuevo'];
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(
    private service: GeneralParameterService,
    public helperService: HelperService
  ) {
    this.breadcrumb = [
      { name: `Inicio`, icon: `fa-duotone fa-house` },
      { name: 'Operativo', icon: 'fa-duotone fa-shop' },
      { name: 'Empresas', icon: 'fa-duotone fa-briefcase' },
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
        this.service.datatable('Empresa', data).subscribe((res) => {
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
          title: 'Nit',
          data: 'nit',
          className: 'text-center',
        },
        {
          title: 'RAZÓN SOCIAL',
          data: 'razonSocial',
          className: 'text-center',
        },
        {
          title: 'DIRECCIÓN',
          data: 'direccion',
          className: 'text-center',
        },
        {
          title: 'TELÉFONO',
          data: 'telefono',
          className: 'text-center',
        },
        {
          title: 'EMAIL',
          data: 'email',
          className: 'text-center',
        },
        {
          title: 'WEB',
          data: 'web',
          className: 'text-center',
        },
        {
          title: 'CONVENIO',
          data: 'convenio',
          className: 'text-center',
        },
        {
          title: 'CIUDAD',
          data: 'ciudad',
          className: 'text-center',
        },
        {
          title: 'ESTADO',
          data: 'activo',
          className: 'text-center',
          render: function (item: any) {
            if (item) {
              return "<label class='text-center text-success'>Activo</label>";
            } else {
              return "<label class='text-center text-danger'>Inactivo</label>";
            }
          },
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
    this.helperService.redirectApp('dashboard/operativo/empresa/crear');
  }

  update(id: any) {
    this.helperService.redirectApp(`dashboard/operativo/empresa/editar/${id}`);
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      // Eliminar imagenes exixtente
      var data = new DatatableParameter();
      data.pageNumber = '';
      data.pageSize = '';
      data.filter = '';
      data.columnOrder = '';
      data.directionOrder = '';
      data.foreignKey = id;
      data.nameForeignKey = 'TablaId';
      this.service.datatableKey('Archivo', data).subscribe((res) => {
        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            if (item.tabla == 'Empresa') {
              this.service.delete('Archivo', item.id).subscribe(() => { });
            }
          });
        }
      });

      this.service.delete('Empresa', id).subscribe(
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
            MessageType.ERROR,
            error
          );
        }
      );
    });
  }
}

@NgModule({
  declarations: [EmpresaIndexComponent],
  imports: [CommonModule, GeneralModule],
})
export class EmpresasIndexModule { }
