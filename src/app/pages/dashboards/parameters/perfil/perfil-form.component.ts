import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../generic/general.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { GeneralParameterFormComponent } from '../../general-parameter/general-parameter-form/general-parameter-form.component';
import { EmpresaFormComponent } from '../empresa/empresa-form/empresa-form.component';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import { PerfilArchivosComponent } from '../perfil-archivos/perfil-archivos.component';

@Component({
    selector: 'app-perfil-form',
    standalone: false,
    templateUrl: './perfil-form.component.html',
    styleUrl: './perfil-form.component.css'
})
export class PerfilFormComponent implements OnInit {
    frmPerfil: FormGroup;
    statusForm: boolean = true;
    id!: number;
    idCliente!: number;
    botones = ['btn-guardar', 'btn-cancelar'];
    title = 'Crear Perfil';
    breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Parametros', icon: 'fa-duotone fa-gears' }, { name: 'Perfil', icon: "fa-duotone fa-user" }, { name: 'Editar', icon: 'fa-duotone fa-pen-to-square' }];
    public lista: any[] = [];
    public listGeneros: any[] = [];
    public ListTipoIdentificacion: any[] = [];
    listArl = signal<DataSelectDto[]>([]);
    listEmpresas = signal<DataSelectDto[]>([]);
    public listaRh: any[] = [{ nombre: 'A+' }, { nombre: 'A-' }, { nombre: 'B+' }, { nombre: 'B-' }, { nombre: 'AB+' }, { nombre: 'AB-' }, { nombre: 'O+' }, { nombre: 'O-' }];
    public listaLectoEscritura: any[] = [{ nombre: 'ALFABETA' }, { nombre: 'ANALFABETA' }];
    public listaTipoCliente: any[] = [{ nombre: 'INDEPENDIENTE' }, { nombre: 'EMPRESA' }];
    public listaNivelEducativo: any[] = [
        { nombre: 'PRIMARIA' },
        { nombre: 'SECUNDARIA' },
        { nombre: 'TECNICO' },
        { nombre: 'TECNOLOGO' },
        { nombre: 'UNIVERSITARIO' },
        { nombre: 'OTRO' },

    ];

    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
        private modalService: NgbModal,
    ) {
        this.frmPerfil = new FormGroup({
            Documento: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            TipoDocumento: new FormControl(null, [Validators.required]),
            PrimerNombre: new FormControl("", [Validators.required, Validators.maxLength(100)]),
            SegundoNombre: new FormControl(""),
            PrimerApellido: new FormControl("", [Validators.required, Validators.maxLength(100)]),
            SegundoApellido: new FormControl(""),
            Email: new FormControl("", [Validators.required, Validators.maxLength(50)]),
            Direccion: new FormControl("", [Validators.required, Validators.maxLength(150)]),
            Telefono: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            Activo: new FormControl(true, Validators.required),
            Genero: new FormControl(null, [Validators.required]),
            CiudadId: new FormControl(null, Validators.required),
            //Cliente
            ClienteId: new FormControl(null),
            Codigo: new FormControl(""),
            TipoCliente: new FormControl(null, [Validators.required]),
            NivelEducativo: new FormControl(null, [Validators.required]),
            CargoActual: new FormControl(null, [Validators.required]),
            AreaTrabajo: new FormControl(null, [Validators.required]),
            LectoEscritura: new FormControl(null, [Validators.required]),
            Rh: new FormControl(null, [Validators.required]),
            Enfermedades: new FormControl("NO REFIERE", [Validators.required]),
            Alergias: new FormControl("NO REFIERE", [Validators.required]),
            Medicamentos: new FormControl("NO REFIERE", [Validators.required]),
            Lesiones: new FormControl("NO REFIERE", [Validators.required]),
            Acudiente: new FormControl(null, [Validators.required]),
            TelefonoAcudiente: new FormControl(null, [Validators.required]),
            PersonaId: new FormControl(null, [Validators.required]),
            ArlId: new FormControl(null, [Validators.required]),
            EmpresaId: new FormControl(null, [Validators.required]),
        });
        this.routerActive.params.subscribe((l) => (this.id = l['id']));
    }

    ngOnInit(): void {
        this.cargarArl(false);
        this.cargarEmpresas(false);
        if (this.id != undefined && this.id != null) {
            this.title = `Editar Perfil`;
            this.service.getById("Persona", this.id).subscribe(l => {
                this.frmPerfil.controls['Documento'].setValue(l.data.documento);
                this.frmPerfil.controls['TipoDocumento'].setValue(l.data.tipoDocumento);
                this.frmPerfil.controls['PrimerNombre'].setValue(l.data.primerNombre);
                this.frmPerfil.controls['SegundoNombre'].setValue(l.data.segundoNombre);
                this.frmPerfil.controls['PrimerApellido'].setValue(l.data.primerApellido);
                this.frmPerfil.controls['SegundoApellido'].setValue(l.data.segundoApellido);
                this.frmPerfil.controls['Email'].setValue(l.data.email);
                this.frmPerfil.controls['Direccion'].setValue(l.data.direccion);
                this.frmPerfil.controls['Telefono'].setValue(l.data.telefono);
                this.frmPerfil.controls['Activo'].setValue(l.data.activo);
                this.frmPerfil.controls['Genero'].setValue(l.data.genero);
                this.frmPerfil.controls['CiudadId'].setValue(l.data.ciudadId);
            });
            //Cliente
            var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = ''; data.foreignKey = Number(this.id); data.nameForeignKey = "PersonaId";
            this.service.datatableKey("Cliente", data).subscribe((l: any) => {
                this.frmPerfil.controls['ClienteId'].setValue(l.data[0].id);
                this.frmPerfil.controls['Codigo'].setValue(l.data[0].codigo);
                this.frmPerfil.controls['TipoCliente'].setValue(l.data[0].tipoCliente);
                this.frmPerfil.controls['NivelEducativo'].setValue(l.data[0].nivelEducativo);
                this.frmPerfil.controls['CargoActual'].setValue(l.data[0].cargoActual);
                this.frmPerfil.controls['AreaTrabajo'].setValue(l.data[0].areaTrabajo);
                this.frmPerfil.controls['LectoEscritura'].setValue(l.data[0].lectoEscritura);
                this.frmPerfil.controls['Rh'].setValue(l.data[0].rh);
                this.frmPerfil.controls['Enfermedades'].setValue(l.data[0].enfermedades);
                this.frmPerfil.controls['Alergias'].setValue(l.data[0].alergias);
                this.frmPerfil.controls['Medicamentos'].setValue(l.data[0].medicamentos);
                this.frmPerfil.controls['Lesiones'].setValue(l.data[0].lesiones);
                this.frmPerfil.controls['Acudiente'].setValue(l.data[0].acudiente);
                this.frmPerfil.controls['TelefonoAcudiente'].setValue(l.data[0].telefonoAcudiente);
                this.frmPerfil.controls['PersonaId'].setValue(l.data[0].personaId);
                this.frmPerfil.controls['ArlId'].setValue(l.data[0].arlId);
                this.frmPerfil.controls['EmpresaId'].setValue(l.data[0].empresaId);
            });
        } else {
            this.title = `Crear Perfil`;
        }

        this.cargarListaCiudad();

        this.ListTipoIdentificacion = [
            { id: 'CC', textoMostrar: 'Cedula de Ciudadania' },
            { id: 'PAS', textoMostrar: 'Pasaporte' },
            { id: 'TI', textoMostrar: 'Tarjeta de Identidad' },
            { id: 'CE', textoMostrar: 'Cedula de Extranjeria' },
        ];

        this.listGeneros = [
            { id: 1, textoMostrar: 'Masculino' },
            { id: 2, textoMostrar: 'Femenino' },
        ];
    }

    cargarListaCiudad() {
        this.service.getAll("Ciudad").subscribe((r) => {
            this.lista = r.data;
        });
    }

    cargarArl(nuevo: boolean) {
        this.service.getAll('Arl').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listArl.update((listArl) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listArl, DataSelectDto];
                });
                if (nuevo) {
                    this.frmPerfil.controls['ArlId'].setValue(item.id);
                }
            });
        });
    }

    cargarEmpresas(nuevo: boolean) {
        this.service.getAll('Empresa').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listEmpresas.update(listEmpresas => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.nit} - ${item.razonSocial}`,
                        activo: item.activo
                    };

                    return [...listEmpresas, DataSelectDto];
                });

                if (nuevo) {
                    this.frmPerfil.controls['EmpresaId'].setValue(item.id);
                }
            });
        });
    }

    nuevaArl() {
        let modal = this.modalService.open(GeneralParameterFormComponent, { size: 'md', keyboard: false, backdrop: false, centered: true });

        modal.componentInstance.titleData = "Arl";
        modal.componentInstance.serviceName = "Arl";

        modal.result.finally(() => {
            this.listArl = signal<DataSelectDto[]>([]);

            setTimeout(() => {
                this.cargarArl(true);
            }, 200);
        });
    }

    nuevaEmpresa() {
        let modal = this.modalService.open(EmpresaFormComponent, { size: 'xl', keyboard: false, backdrop: false, centered: true });
        modal.result.finally(() => {
            this.listEmpresas = signal<DataSelectDto[]>([]);

            setTimeout(() => {
                this.cargarEmpresas(true);
            }, 200);
        });
    }

    save() {
        if (this.frmPerfil.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        this.frmPerfil.controls['Telefono'].setValue(String(this.frmPerfil.controls['Telefono'].value));
        this.helperService.showLoading();
        let data = {
            id: this.id ?? 0,
            ...this.frmPerfil.value,
        };
        this.service.save("Rol", this.id, data).subscribe(
            (response) => {
                if (response.status) {
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                    this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
                    this.helperService.redirectApp(`dashboard/seguridad/roles/editar/${response.data.id}`);
                } else {
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                }
            },
            (error) => {
                setTimeout(() => {
                    this.helperService.hideLoading();
                }, 200);
                this.helperService.showMessage(MessageType.ERROR, error);
            }
        );
    }

    cancel() {
        this.helperService.redirectApp('dashboard');
    }
}

@NgModule({
    declarations: [
        PerfilFormComponent,
        PerfilArchivosComponent
    ],
    imports: [
        CommonModule,
        GeneralModule,
        NgbNavModule
    ],
})
export class PerfilFormModule { }