import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralParameterService } from '../generic/general.service';
import { DataSelectDto } from '../generic/dataSelectDto';
import { HelperService, Messages, MessageType } from '../admin/helper.service';
import { DatatableParameter } from '../admin/datatable.parameters';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-inscripciones',
    templateUrl: './inscripciones.component.html',
    styleUrls: ['./inscripciones.component.css']
})

/**
 * Inscripciones Component
 */
export class InscripcionesComponent implements OnInit {
    currentSection = 'inscripcion';
    isCollapsed = true;
    year: number = new Date().getFullYear();
    frmInscripcion: FormGroup;
    statusForm: boolean = true
    key: string = "Ciudad";
    lista: any[] = [];
    listGeneros: any[] = [];
    ListTipoIdentificacion: any[] = [];
    listArl = signal<DataSelectDto[]>([]);
    listEmpresas = signal<DataSelectDto[]>([]);
    listCiudades = signal<DataSelectDto[]>([]);
    listaRh: any[] = [{ nombre: 'A+' }, { nombre: 'A-' }, { nombre: 'B+' }, { nombre: 'B-' }, { nombre: 'AB+' }, { nombre: 'AB-' }, { nombre: 'O+' }, { nombre: 'O-' }];
    listaLectoEscritura: any[] = [{ nombre: 'ALFABETA' }, { nombre: 'ANALFABETA' }];
    listaTipoCliente: any[] = [{ nombre: 'INDEPENDIENTE' }];
    listaNivelEducativo: any[] = [
        { nombre: 'PRIMARIA' },
        { nombre: 'SECUNDARIA' },
        { nombre: 'TECNICO' },
        { nombre: 'TECNOLOGO' },
        { nombre: 'UNIVERSITARIO' },
        { nombre: 'OTRO' },

    ];
    listCursos = signal<DataSelectDto[]>([]);
    listCursosDetalles = signal<DataSelectDto[]>([]);
    curso = false;
    cursoDetalle = false;
    precio = "0";
    contentDocumento: string = "";
    contentSoporte: string = "";

    constructor(
        private service: GeneralParameterService,
        private helperService: HelperService,
    ) {
        this.frmInscripcion = new FormGroup({
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
            PersonaId: new FormControl(0, [Validators.required]),
            ArlId: new FormControl(null, [Validators.required]),
            EmpresaId: new FormControl(null, [Validators.required]),
            CursoId: new FormControl(null, [Validators.required]),
            CursoDetalleId: new FormControl(null, [Validators.required]),
            DocumentoIdentidad: new FormControl(null, [Validators.required]),
            Pago: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.helperService.showLoading();
        this.cargarArl();
        this.cargarEmpresas();
        this.cargarCiudades();
        this.cargarCursos();

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

        this.frmInscripcion.controls["TipoCliente"].setValue("INDEPENDIENTE");
    }

    cargarListaForeingKey() {
        this.service.getAll(this.key).subscribe((r) => {
            this.lista = r.data;
        });
    }

    cargarArl() {
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
            });
        });
    }

    cargarCiudades() {
        this.service.getAll('Ciudad').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listCiudades.update((listCiudades) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listCiudades, DataSelectDto];
                });
            });
        });
    }

    cargarEmpresas() {
        this.service.getAll('Empresa').subscribe((res) => {
            res.data.forEach((item: any) => {
                if (item.razonSocial == "INDEPENDIENTE") {
                    this.listEmpresas.update(listEmpresas => {
                        const DataSelectDto: DataSelectDto = {
                            id: item.id,
                            textoMostrar: `${item.nit} - ${item.razonSocial}`,
                            activo: item.activo
                        };

                        return [...listEmpresas, DataSelectDto];
                    });
                };
                this.frmInscripcion.controls["EmpresaId"].setValue(item.id);
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
            setTimeout(() => {
                this.helperService.hideLoading();
            }, 200);
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
            this.service.getById("CursoDetalle", event.id).subscribe((res: any) => {
                this.precio = this.helperService.formaterNumber(res.data.precio).toString();
            });
        } else {
            this.cursoDetalle = false;
        }
    }

    cargarCursoDetalle(cursoId: number) {
        this.listCursosDetalles = signal<DataSelectDto[]>([]);
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = ''; data.foreignKey = cursoId; data.nameForeignKey = "CursoId";

        this.service.dataTableAbierto('CursoDetalle', data).subscribe((res) => {
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

    save() {
        if (this.frmInscripcion.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        this.helperService.showLoading();
        this.frmInscripcion.controls['Telefono'].setValue(String(this.frmInscripcion.controls['Telefono'].value));
        this.frmInscripcion.controls['TelefonoAcudiente'].setValue(this.frmInscripcion.controls['TelefonoAcudiente'].value.toString());

        let persona = {
            Id: 0,
            TipoDocumento: this.frmInscripcion.controls["TipoDocumento"].value,
            Documento: this.frmInscripcion.controls["Documento"].value,
            PrimerNombre: this.frmInscripcion.controls["PrimerNombre"].value,
            SegundoNombre: this.frmInscripcion.controls["SegundoNombre"].value,
            PrimerApellido: this.frmInscripcion.controls["PrimerApellido"].value,
            SegundoApellido: this.frmInscripcion.controls["SegundoApellido"].value,
            Direccion: this.frmInscripcion.controls["Direccion"].value,
            Telefono: this.frmInscripcion.controls["Telefono"].value,
            Email: this.frmInscripcion.controls["Email"].value,
            Genero: this.frmInscripcion.controls["Genero"].value,
            CiudadId: this.frmInscripcion.controls["CiudadId"].value,
            Activo: this.frmInscripcion.controls["Activo"].value,
        }

        let cliente = {
            Id: 0,
            Activo: this.frmInscripcion.controls["Activo"].value,
            Codigo: this.frmInscripcion.controls["Codigo"].value,
            TipoCliente: this.frmInscripcion.controls["TipoCliente"].value,
            NivelEducativo: this.frmInscripcion.controls["NivelEducativo"].value,
            CargoActual: this.frmInscripcion.controls["CargoActual"].value,
            AreaTrabajo: this.frmInscripcion.controls["AreaTrabajo"].value,
            LectoEscritura: this.frmInscripcion.controls["LectoEscritura"].value,
            Rh: this.frmInscripcion.controls["Rh"].value,
            Enfermedades: this.frmInscripcion.controls["Enfermedades"].value,
            Alergias: this.frmInscripcion.controls["Alergias"].value,
            Medicamentos: this.frmInscripcion.controls["Medicamentos"].value,
            Lesiones: this.frmInscripcion.controls["Lesiones"].value,
            Acudiente: this.frmInscripcion.controls["Acudiente"].value,
            TelefonoAcudiente: this.frmInscripcion.controls["TelefonoAcudiente"].value,
            PersonaId: this.frmInscripcion.controls["PersonaId"].value,
            ArlId: this.frmInscripcion.controls["ArlId"].value,
            EmpresaId: this.frmInscripcion.controls["EmpresaId"].value,
        }

        this.service.save("Persona", 0, persona).subscribe(
            (response) => {
                if (response.status) {
                    cliente.PersonaId = response.data.id;

                    setTimeout(() => {
                        this.SaveCliente(cliente);
                    }, 200);
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
                this.helperService.showMessage(MessageType.WARNING, error);
            }
        );

    }

    SaveCliente(data: any) {
        let inscripcion = {
            Id: 0,
            Activo: this.frmInscripcion.controls["Activo"].value,
            CursoDetalleId: this.frmInscripcion.controls["CursoDetalleId"].value,
            ClienteId: 0,
            UsuarioRegistro: "",
        }

        this.service.save('Cliente', 0, data).subscribe(
            (response) => {
                if (response.status) {
                    inscripcion.ClienteId = response.data.id;

                    setTimeout(() => {
                        this.SaveInscripcion(inscripcion);
                    }, 200);
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
                this.helperService.showMessage(MessageType.WARNING, error);
            }
        );
    }

    SaveInscripcion(data: any) {
        this.service.save('Inscripcion', 0, data).subscribe(
            (response) => {
                if (response.status) {
                    this.SaveArchivo(data.ClienteId);
                    this.helperService.showMessage(
                        MessageType.SUCCESS,
                        Messages.SAVESUCCESS
                    );
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                    this.frmInscripcion.reset();
                    this.curso = false;
                    this.listCursosDetalles = signal<DataSelectDto[]>([]);
                }
            },
            (error) => {
                setTimeout(() => {
                    this.helperService.hideLoading();
                }, 200);
                this.helperService.showMessage(MessageType.WARNING, error);
            }
        );
    }

    SaveArchivo(clienteId: number) {
        let data = {
            Nombre: "",
            TablaId: clienteId,
            Tabla: 'Clientes',
            Extension: "pdf",
            Content: "",
            Activo: true,
        };

        //Guardo el documento de identidad
        data.Nombre = "Documento de Identidad";
        data.Content = this.contentDocumento;
        this.service.save("Archivo", 0, data).subscribe((res: any) => {
            if (res.status) {
                console.log("Documento de identidad guardado correctamente.");
            } else {
                console.log("Error al guardar el documento de identidad.");
            }
        });

        //Guardo el documento de la eps
        data.Nombre = "Soporte de Pago";
        data.Content = this.contentSoporte;
        data.Extension = "jpg";
        this.service.save("Archivo", 0, data).subscribe((res: any) => {
            if (res.status) {
                console.log("Soporte de pago guardado correctamente");
            } else {
                console.log("Error al guardar el soporte de pago");
            }
        });
    }

    convertToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    //Events Input
    onChangeDocumento(event: any) {
        if (typeof event != "undefined") {
            const file: File = event.target.files[0];
            this.convertToBase64(file).then((base64Content: string) => {
                this.contentDocumento = base64Content;
            }).catch((error: any) => {
                this.helperService.showMessage(MessageType.ERROR, error);
            });
        }
    }

    onChangeSoporte(event: any) {
        if (typeof event != "undefined") {
            const file: File = event.target.files[0];
            this.convertToBase64(file).then((base64Content: string) => {
                this.contentSoporte = base64Content;
            }).catch((error: any) => {
                this.helperService.showMessage(MessageType.ERROR, error);
            });
        }
    }

    CertificadoBancario() {
        Swal.fire(`<h2>Datos Bancarios</h2>
                    <h5>SAFETY, HEALTH AND WORK RISK CONSULTANTS</h5>
                    <h5>NIT: 901202775</h5>
                    <h5>BANCOLOMBIA</h5>
                    <h5>CUENTA DE AHORROS</h5>
                    <h5>No. Producto: 74100008650</h5>`);
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