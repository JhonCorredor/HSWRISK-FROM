import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import * as XLSX from 'xlsx';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-clientes-import',
    standalone: false,
    templateUrl: './clientes-import.component.html',
    styleUrl: './clientes-import.component.css'
})
export class ClientesImportComponent implements OnInit {
    frmImportCliente: FormGroup;
    statusForm: boolean = true
    botones = ['btn-cancelar'];
    file?: File;
    clientes: any[] = [];
    listEmpresas = signal<DataSelectDto[]>([]);
    listArl = signal<DataSelectDto[]>([]);
    listCiudades = signal<DataSelectDto[]>([]);
    listCursosDetalles = signal<DataSelectDto[]>([]);
    listCursos = signal<DataSelectDto[]>([]);
    curso = false;
    excelStartDate = new Date('1899-12-30');

    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
        private modalActive: NgbActiveModal,
    ) {
        this.frmImportCliente = new FormGroup({
            CursoId: new FormControl(null, [Validators.required]),
            EmpresaId: new FormControl(null, Validators.required),
            CiudadId: new FormControl(null, Validators.required),
            ArlId: new FormControl(null, Validators.required),
            CursoDetalleId: new FormControl(null, [Validators.required]),
            UsuarioRegistro: new FormControl("", [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.helperService.showLoading();
        this.cargarArl();
        this.cargarEmpresas();
        this.cargarCiudades();
        this.cargarCursos();
        this.cargarUsuario();
        this.validarEmpleado();
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
                this.listEmpresas.update(listEmpresas => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.nit} - ${item.razonSocial}`,
                        activo: item.activo
                    };

                    return [...listEmpresas, DataSelectDto];
                });
            });
        });
    }

    cancel() {
        this.modalActive.close();
    }

    readURL(event: any) {
        if (this.frmImportCliente.invalid) {
            this.removeUpload();
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        if (event.target.files && event.target.files[0]) {
            $('.archivo-upload-wrap').hide();
            $('.archivo-title').html(event.target.files[0].name);
            $('.file-upload-content').show();

            const reader = new FileReader();
            reader.readAsArrayBuffer(event.target.files[0]);

            reader.onload = (e: any) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const xlsxData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                this.readFile(xlsxData);
            };
        } else {
            this.removeUpload();
        }
    }

    removeUpload() {
        $('.file-upload-input').replaceWith($('.file-upload-input').clone());
        $('.file-upload-content').hide();
        $('.archivo-upload-wrap').show();
        $('.archivo-upload-wrap').removeClass('archivo-dropping');
        this.clientes = [];
    }

    readFile(data: any) {
        console.log(data);
        for (let i = 1; i < data.length; i++) {
         
            var element = data[i];
            if (element.length > 1) {
                var genero = "Masculino";
                if (element[9] == "F") {
                    genero = "Femenino"
                };
                var correoValidado = this.validarCorreo(element[7]);

                if (!correoValidado) {
                    this.helperService.showMessage(MessageType.WARNING, "El valor del correo no coincide con las restricciones de validación de datos definidas.");
                    break;
                }
               // Validar campos requeridos
            const requiredFields = [
                { name: "PrimerNombre", value: element[0] },
                { name: "PrimerApellido", value: element[2] },
                { name: "TipoDocumento", value: element[4] },
                { name: "Documento", value: element[5] },
                { name: "Direccion", value: element[6] },
                { name: "Email", value: element[7] },
                { name: "LevelReadings", value: element[12] },
                { name: "NivelEducativo", value: element[13] },
                { name: "AreaTrabajo", value: element[14] },
                { name: "CargoActual", value: element[15] },
                { name: "SectorEducatives", value: element[16] },
                { name: "Rh", value: element[17] },
                { name: "Alergias", value: element[18] },
                { name: "Medicamentos", value: element[19] },
                { name: "Lesiones", value: element[20] },
                { name: "Enfermedades", value: element[21] },
                { name: "Acudiente", value: element[22] },
                { name: "Parentesco", value: element[23] },
                { name: "TelefonoAcudiente", value: element[24] },
                { name: "CountryBirth", value: element[24] },
            ];

            const emptyField = requiredFields.find(field => !field.value || field.value.toString().trim() === "");
            if (emptyField) {
                this.helperService.showMessage(
                    MessageType.WARNING,
                    `El campo ${emptyField.name} es obligatorio y no puede estar vacío.`
                );
                break;
            }
                var cliente: any = {
                    PrimerNombre: element[0],
                    SegundoNombre: element[1],
                    PrimerApellido: element[2],
                    SegundoApellido: element[3],
                    TipoDocumento: element[4],
                    Documento: element[5].toString(),
                    Direccion: element[6],
                    Email: element[7],
                    Telefono: element[8].toString(),
                    Genero: genero,
                    DateBirth: new Date(this.excelStartDate.getTime() + (element[10] - 1) * 24 * 60 * 60 * 1000),
                    LevelReadings:element[11],
                    LectoEscritura:element[12],
                    NivelEducativo: element[13],
                    AreaTrabajo: element[14],
                    CargoActual: element[15],
                    SectorEducatives: element[16],
                    Rh: element[17],
                    Alergias: element[18],
                    Medicamentos: element[19],
                    Lesiones: element[20],
                    Enfermedades: element[21],
                    Acudiente: element[22],
                    Parentesco:element[23],
                    TelefonoAcudiente: element[21].toString(),
                    CountryBirth: element[24],
                    Codigo: "",
                    TipoCliente: "EMPRESA",
                    ArlId: this.frmImportCliente.controls["ArlId"].value,
                    EmpresaId: this.frmImportCliente.controls["EmpresaId"].value,
                    CiudadId: this.frmImportCliente.controls["CiudadId"].value,
                    UsuarioRegistro: this.frmImportCliente.controls["UsuarioRegistro"].value,
                    CursoDetalleId: this.frmImportCliente.controls["CursoDetalleId"].value,
                    PersonaId: 0,
                }
                this.clientes.push(cliente);
            }
        }
    }

    upload() {
        if (this.frmImportCliente.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }

        this.helperService.showLoading();
        this.service.saveDetalles('Cliente', this.clientes).subscribe(
            (response) => {
                if (response.status) {
                    this.modalActive.close(true);
                    this.helperService.hideLoading();
                    this.helperService.showMessage(MessageType.SUCCESS, "Datos importados correctamente");
                }
            },
            (error) => {
                this.helperService.hideLoading();
                this.helperService.showMessage(MessageType.ERROR, error);
            }
        );
    }

    validarCorreo(email: string) {
        let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        let validado = emailRegex.test(email);
        return validado;
    }

    downloadFile() {
        let link = document.createElement("a");
        link.download = "Plantilla Clientes.xlsx";
        link.href = "/assets/excel/plantilla_clientes.xlsx";
        link.click();
        link.remove();
    }

    validarEmpleado() {
        var personaId = localStorage.getItem("persona_Id");
        if (personaId != null) {
            var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = personaId; data.nameForeignKey = "PersonaId";
            this.service.datatableKey("Empleado", data).subscribe((empleado) => {
                if (empleado.data.length == 1) {
                    this.service.getById("Empresa", empleado.data[0].empresaId).subscribe((empresa: any) => {
                        if (empresa.status) {
                            this.frmImportCliente.controls["EmpresaId"].setValue(empresa.data.id);
                            this.frmImportCliente.controls["CiudadId"].setValue(empresa.data.ciudadId);
                        }
                        setTimeout(() => {
                            this.helperService.hideLoading();
                        }, 200);
                    });
                } else {
                    Swal.fire({
                        title: '¡No existe un empleado con este usuario!',
                        icon: 'warning',
                    }).then(() => {
                        this.modalActive.close();
                        this.helperService.redirectApp("/dashboard");
                    });
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                }
            })
        }
    }

    cargarUsuario() {
        var personaId = localStorage.getItem("persona_Id");
        this.service.getById("Persona", personaId).subscribe(
            (res: any) => {
                if (res.status) {
                    this.frmImportCliente.controls["UsuarioRegistro"].setValue(`${res.data.primerNombre} ${res.data.primerApellido}`);
                }
            }
        )
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
                        textoMostrar: `${item.curso} - ${item.salon} - ${item.nivel} - ${item.jornada} - Fecha Inicio: ${this.helperService.convertDateUTCToDMA(item.fechaInicio)} `,
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
}

@NgModule({
    declarations: [
        ClientesImportComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule
    ]
})
export class GeneralParameterFormModule { }