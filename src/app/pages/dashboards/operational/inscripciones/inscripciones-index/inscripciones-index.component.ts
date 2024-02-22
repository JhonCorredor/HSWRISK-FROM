import { Component, OnInit, NgModule, ViewChild, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientesImportComponent } from '../../../parameters/clientes/clientes-import/clientes-import.component';

@Component({
    selector: 'app-inscripciones-index',
    standalone: false,
    templateUrl: './inscripciones-index.component.html',
    styleUrl: './inscripciones-index.component.css',
})
export class InscripcionesIndexComponent implements OnInit {
    title = 'Listado de Inscripciones';
    breadcrumb!: any[];
    botones: String[] = ['btn-importar-cliente', 'btn-nuevo'];
    listCursos = signal<DataSelectDto[]>([]);
    listCursosDetalles = signal<DataSelectDto[]>([]);
    curso = false;
    cursoDetalle = false;

    public dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    frmInscripciones: FormGroup;
    statusForm: boolean = true;

    constructor(
        private service: GeneralParameterService,
        public helperService: HelperService,
        private modalService: NgbModal,
        private datePipe: DatePipe
    ) {
        this.breadcrumb = [
            { name: `Inicio`, icon: `fa-duotone fa-house` },
            { name: 'Operativo', icon: 'fa-duotone fa-shop' },
            { name: 'Inscripciones', icon: 'fa-duotone fa-clipboard-check' },
        ];

        this.frmInscripciones = new FormGroup({
            CursoId: new FormControl(null, [Validators.required]),
            CursoDetalleId: new FormControl(null, [Validators.required]),
            FechaInicio: new FormControl(null, [Validators.required]),
            FechaFin: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.cargarLista();
        this.cargarCursos();
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
                this.service.dataTableLastCourseDetails('Inscripcion', data).subscribe((res) => {
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
                    title: 'FECHA',
                    data: 'createAt',
                    className: 'text-center',
                    render: (item: any) => {
                        return this.helperService.convertDateTime(item);
                    },
                },
                {
                    title: 'CÓDIGO',
                    data: 'codigo',
                    className: 'text-center',
                },
                {
                    title: 'CLIENTE',
                    data: 'cliente',
                    className: 'text-center',
                },
                {
                    title: 'ESTADO',
                    data: 'estado',
                    className: 'text-center',
                },
                {
                    title: 'DETALLE DEL CURSO',
                    data: 'cursoDetalle',
                    className: 'text-center',
                },
                // {
                //     title: 'ACCIONES',
                //     orderable: false,
                //     data: 'id',
                //     className: 'text-center',
                //     render: function (id: any) {
                //         return `<div role="group"  class="button-group " aria-label="Basic example">
                //                     <button type="button" title="Editar" class="btn btn-sm text-secondary btn-dropdown-modificar" data-id="${id}"><i class="fa-duotone fa-pen-to-square" data-id="${id}"></i> Editar</button>
                //                     <button type="button" title="Eliminar" class="btn btn-sm text-secondary btn-dropdown-eliminar" data-id="${id}"><i class="fa-duotone fa-trash-can" data-id="${id}"></i> Eliminar</button>
                //                   </div>`;
                //     },
                // },
            ],
            //drawCallback: () => {
            //     $('.btn-dropdown-modificar')
            //         .off()
            //         .on('click', (event: any) => {
            //             this.update(event.currentTarget.dataset.id);
            //         });

            //     $('.btn-dropdown-eliminar')
            //         .off()
            //         .on('click', (event: any) => {
            //             this.deleteGeneric(event.currentTarget.dataset.id);
            //         });
            // },
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
        this.helperService.redirectApp('dashboard/operativo/inscripciones/crear');
    }

    update(id: any) {
        this.helperService.redirectApp(`dashboard/operativo/inscripciones/editar/${id}`);
    }

    deleteGeneric(id: any) {
        this.helperService.confirmDelete(() => {
            this.service.delete('Inscripcion', id).subscribe(
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

    importarDatos() {
        let modal = this.modalService.open(ClientesImportComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });
        modal.result.then(res => {
            if (res) {
                this.refrescarTabla();
            }
        })
    }

    cargarCursos() {
        this.service.getAll('Curso').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listCursos.update((listCursos) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listCursos, DataSelectDto];
                });
            });
        });
    }

    cargarCursoDetalle(cursoId: number) {
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = ''; data.foreignKey = cursoId; data.nameForeignKey = "CursoId";

        this.service.datatableKey('CursoDetalle', data).subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listCursosDetalles.update((listCursosDetalles) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.curso} - ${item.salon} - ${item.nivel} - ${item.jornada}`,
                        activo: item.activo,
                    };

                    return [...listCursosDetalles, DataSelectDto];
                });
            });
        });
    }

    onChangeCurso(event: any) {
        if (typeof event != "undefined") {
            this.curso = true;
            this.cargarCursoDetalle(event.id);
        } else {
            this.curso = false;
            this.listCursosDetalles = signal<DataSelectDto[]>([]);
        }
    }

    onChangeCursoDetalle(event: any) {
        if (typeof event != "undefined") {
            this.cursoDetalle = true;
        } else {
            this.cursoDetalle = false;
        }
    }

    buscar() {
        if (this.frmInscripciones.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        this.helperService.showLoading();
        this.cargarListaFilter();
    }

    cargarListaFilter() {
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = ''; data.foreignKey = this.frmInscripciones.controls["CursoDetalleId"].value; data.nameForeignKey = "CursoDetalleId"; data.fechaInicio = this.formatDate(this.frmInscripciones.controls["FechaInicio"].value); data.fechaFin = this.formatDate(this.frmInscripciones.controls["FechaFin"].value);
        this.service.datatableKey('Inscripcion', data).subscribe((res) => {
            // Actualiza los datos de la tabla
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.clear().rows.add(res.data).draw();
            });
        });

        setTimeout(() => {
            this.helperService.hideLoading();
        }, 500);
    }

    formatDate(inputDate: string): string {
        // Convert input string to Date object
        let dateObject = new Date(inputDate);

        // Format the date using DatePipe
        return this.datePipe.transform(dateObject, 'yyyy-MM-dd HH:mm:ss') || "Invalid Date";
    }
}

@NgModule({
    declarations: [InscripcionesIndexComponent],
    imports: [CommonModule, GeneralModule],
})
export class InscripcionesIndexModule { }
