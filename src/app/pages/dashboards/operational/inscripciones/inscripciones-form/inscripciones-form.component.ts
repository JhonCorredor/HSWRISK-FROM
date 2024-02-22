import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';

@Component({
    selector: 'app-inscripciones-form',
    standalone: false,
    templateUrl: './inscripciones-form.component.html',
    styleUrl: './inscripciones-form.component.css',
})
export class IncripcionesFormComponent implements OnInit {
    frmInscripciones: FormGroup;
    statusForm: boolean = true;
    id!: number;
    botones = ['btn-guardar', 'btn-cancelar'];
    title = 'Crear Inscripción';
    breadcrumb = [
        { name: `Inicio`, icon: `fa-duotone fa-house` },
        { name: 'Operativo', icon: 'fa-duotone fa-shop' },
        { name: 'Inscripciones', icon: 'fa-duotone fa-clipboard-check' },
        { name: 'Crear', icon: 'fa-duotone fa-octagon-plus' },
    ];
    listClientes = signal<DataSelectDto[]>([]);
    listCursos = signal<DataSelectDto[]>([]);
    listCursosDetalles = signal<DataSelectDto[]>([]);
    curso = false;

    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
        private modalService: NgbModal,
        private router: Router
    ) {
        this.frmInscripciones = new FormGroup({
            CursoId: new FormControl(null, [Validators.required]),
            CursoDetalleId: new FormControl(null, [Validators.required]),
            ClienteId: new FormControl(null, [Validators.required]),
            UsuarioRegistro: new FormControl("", [Validators.required]),
        });
        this.routerActive.params.subscribe((l) => (this.id = l['id']));
    }

    ngOnInit(): void {
        this.cargarUsuario();
        this.cargarClientes();
        this.cargarCursos();
        if (this.id != undefined && this.id != null) {
            this.title = 'Editar Inscripción';
            this.breadcrumb = [
                { name: `Inicio`, icon: `fa-duotone fa-house` },
                { name: 'Operativo', icon: 'fa-duotone fa-shop' },
                { name: 'Inscripciones', icon: 'fa-duotone fa-clipboard-check' },
                { name: 'Editar', icon: 'fa-duotone fa-pen-to-square' },
            ];
            this.service.getById('Inscripcion', this.id).subscribe((l) => {
                this.frmInscripciones.controls['ClienteId'].setValue(l.data.clienteId);
                this.frmInscripciones.controls['CursoDetalleId'].setValue(l.data.cursoDetalleId);
            });
        }
    }

    save() {
        if (this.frmInscripciones.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        let data = {
            id: this.id ?? 0,
            ...this.frmInscripciones.value,
        };
        this.service.save('Inscripcion', this.id, data).subscribe(
            (response) => {
                if (response.status) {
                    this.helperService.showMessage(
                        MessageType.SUCCESS,
                        Messages.SAVESUCCESS
                    );

                    var ruta: string[] = this.router.url.toString().split('/');

                    console.log(ruta);
                    if (ruta[2] != 'operativo') {
                        this.modalService.dismissAll();
                    } else {
                        this.helperService.redirectApp('dashboard/operativo/inscripciones');
                    }
                }
            },
            (error) => {
                this.helperService.showMessage(MessageType.WARNING, error);
            }
        );
    }

    cancel() {
        var ruta: string[] = this.router.url.toString().split('/');
        if (ruta[2] != 'operativo') {
            this.modalService.dismissAll();
        } else {
            this.helperService.redirectApp('dashboard/operativo/inscripciones');
        }
    }

    cargarClientes() {
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = '';

        this.service.datatable('Cliente', data).subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listClientes.update((listClientes) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.persona}`,
                        activo: item.activo,
                    };

                    return [...listClientes, DataSelectDto];
                });
            });
        });
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

    cargarUsuario() {
        var personaId = localStorage.getItem("persona_Id");
        this.service.getById("Persona", personaId).subscribe(
            (res: any) => {
                if (res.status) {
                    this.frmInscripciones.controls["UsuarioRegistro"].setValue(`${res.data.primerNombre} ${res.data.primerApellido}`);
                }
            }
        )
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
}
@NgModule({
    declarations: [IncripcionesFormComponent],
    imports: [CommonModule, GeneralModule],
})
export class IncripcionesFormModule { }