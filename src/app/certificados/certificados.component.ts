import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralParameterService } from '../generic/general.service';
import { HelperService, Messages, MessageType } from '../admin/helper.service';
import { DatatableParameter } from '../admin/datatable.parameters';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { LANGUAGE_DATATABLE } from '../admin/datatable.language';

@Component({
    selector: 'app-certificados',
    standalone: false,
    templateUrl: './certificados.component.html',
    styleUrls: ['./certificados.component.css']
})

/**
 * Certificados Component
 */
export class CertificadosComponent implements OnInit {
    year: number = new Date().getFullYear();
    frmCertificados: FormGroup;
    statusForm: boolean = true;
    isCollapsed = true;
    currentSection = 'certificados';
    lista: any[] = [
        {
            "id": "Codigo",
            "textoMostrar": "Código Certificado"
        },
        {
            "id": "Documento",
            "textoMostrar": "Número de documento"
        }
    ];

    public dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(
        private service: GeneralParameterService,
        private helperService: HelperService
    ) {
        this.frmCertificados = new FormGroup({
            Criterio: new FormControl(null, [Validators.required]),
            Valor: new FormControl(null, [Validators.required]),
        });
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
            processing: true,
            ordering: true,
            responsive: true,
            paging: true,
            order: [0, 'desc'],
            language: LANGUAGE_DATATABLE,
            ajax: (dataTablesParameters: any, callback: any) => {
                callback({
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    draw: dataTablesParameters.draw,
                    data: [],
                });
            },
            columns: [
                {
                    title: 'CÓDIGO',
                    data: 'codigo',
                    className: 'text-center',
                },
                {
                    title: 'DESCRIPCIÓN',
                    data: 'descripcion',
                    className: 'text-center',
                },
                {
                    title: 'FECHA DE EXPEDICIÓN',
                    data: 'fechaExpedicion',
                    className: 'text-center',
                    render: (item: any) => {
                        return this.helperService.convertDateTime(item);
                    },
                },
                {
                    title: 'FECHA DE VENCIMIENTO',
                    data: 'fechaVencimiento',
                    className: 'text-center',
                    render: (item: any) => {
                        return this.helperService.convertDateTime(item);
                    },
                },
                {
                    title: 'CURSO',
                    data: 'curso',
                    className: 'text-center',
                },
                {
                    title: 'DURACIÓN',
                    data: 'duracion',
                    className: 'text-center',
                },
                {
                    title: 'DOCUMENTO CLIENTE',
                    data: 'documentoCliente',
                    className: 'text-center',
                },
                {
                    title: 'CLIENTE',
                    data: 'cliente',
                    className: 'text-center',
                },
                {
                    title: 'INSTRUCTOR',
                    data: 'empleado',
                    className: 'text-center',
                },
            ],
        };
    }

    refrescarTabla() {
        if (typeof this.dtElement.dtInstance != 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
            });
        }
    }

    buscar() {
        if (this.frmCertificados.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        this.helperService.showLoading();
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = this.frmCertificados.controls["Valor"].value; data.columnFilter = this.frmCertificados.controls["Criterio"].value; data.columnOrder = ''; data.directionOrder = '';

        this.service.getCertificado("Certificado", data).subscribe((res: any) => {
            // Actualiza los datos de la tabla

            if (!res.status || !res.data || res.data.length === 0) {

                // Mostrar el mensaje de error si no se encontró el empleado o si no hay datos
                this.helperService.showMessage(MessageType.WARNING, "No se encontraron certificados con este numero de indentificación");
                this.helperService.hideLoading();
                return; 
            }

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.clear().rows.add(res.data).draw();
            });

        });

        setTimeout(() => {
            this.frmCertificados.reset();
            this.helperService.hideLoading();
        }, 200);
    }

    limpiarConsulta() {
        this.helperService.showLoading();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear().rows.add([]).draw();
        });
        setTimeout(() => {
            this.helperService.hideLoading();
        }, 200);
    }

    //PAGE
    /**
    * Section changed method
    * @param sectionId specify the current sectionID
    */
    onSectionChange(sectionId: string) {
        this.currentSection = sectionId;
    }

    /**
      * Window scroll method
      */
    // tslint:disable-next-line: typedef
    windowScroll() {
        const navbar = document.getElementById('navbar');
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            navbar?.classList.add('is-sticky');
        }
        else {
            navbar?.classList.remove('is-sticky');
        }

        // Top Btn Set
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            (document.getElementById("back-to-top") as HTMLElement).style.display = "block"
        } else {
            (document.getElementById("back-to-top") as HTMLElement).style.display = "none"
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}