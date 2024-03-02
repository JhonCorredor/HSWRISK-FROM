import { Component, Input, OnInit, signal } from '@angular/core';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../generic/general.service';
import { Archivo } from '../clientes/clientes-archivos/archivos.module';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-perfil-archivos',
    standalone: false,
    templateUrl: './perfil-archivos.component.html',
    styleUrl: './perfil-archivos.component.css'
})
export class PerfilArchivosComponent implements OnInit {
    @Input() PersonaId: any = null;
    ClienteId: any = null;
    frmArchivosClientes: FormGroup;
    statusForm: boolean = true;
    listClientesArchivos = signal<Archivo[]>([]);
    list: any = [
        {
            "value": "Copia de la cedula (150%) o del permiso por protección temporal y permanencia (PPT)",
            "textoMostrar": "Copia de la cedula (150%) o del permiso por protección temporal y permanencia (PPT)",
        },
        {
            "value": "Examen médico y concepto de aptitud ocupacional de alturas vigente",
            "textoMostrar": "Examen médico y concepto de aptitud ocupacional de alturas vigente (máximo 6 meses)",
        },
        {
            "value": "Copia de planilla de aportes a la seguridad social vigente o certificado de afiliación a la EPS",
            "textoMostrar": "Copia de planilla de aportes a la seguridad social vigente o certificado de afiliación a la EPS",
        },
        {
            "value": "ARL",
            "textoMostrar": "ARL (si esta recién contratado)",
        },
        {
            "value": "Copia del certificado de alturas avanzado - autorizado",
            "textoMostrar": "Copia del certificado de alturas avanzado - autorizado (sólo para hacer Reentrenamiento)",
        },
        {
            "value": "Carta u oficio del empleador de experiencia mínima de un año",
            "textoMostrar": "Carta u oficio del empleador de experiencia mínima de un año (sólo para hacer Coordinador)",
        },
        {
            "value": "Copia certificado Coordinador",
            "textoMostrar": "Copia certificado Coordinador (sólo aplica para hacer Actualización de Coordinador)",
        },
        {
            "value": "Copia completa del (RUT) de la empresa",
            "textoMostrar": "Copia completa del (RUT) de la empresa donde se evidencie la información del representante legal",
        },
        {
            "value": "Soporte de Pago",
            "textoMostrar": "Soporte de Pago",
        },
    ];
    content = "";
    botones = ['btn-guardar'];

    constructor(
        private helperService: HelperService,
        private service: GeneralParameterService
    ) {
        this.frmArchivosClientes = new FormGroup({
            Nombre: new FormControl(null, [Validators.required]),
            Content: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.cargarLista();
    }

    cargarLista() {
        this.getData().then((datos) => {
            datos.data.forEach((item: any) => {
                this.listClientesArchivos.update(listClientesArchivos => {
                    const Archivo: Archivo = {
                        id: item.id,
                        activo: item.activo,
                        nombre: item.nombre,
                        tablaId: item.tablaId,
                        tabla: item.tabla,
                        extension: item.extension,
                        content: item.content,

                    };

                    return [...listClientesArchivos, Archivo];
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
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = ''; data.foreignKey = Number(this.PersonaId); data.nameForeignKey = "PersonaId";
        return new Promise((resolve, reject) => {
            this.service.datatableKey("Cliente", data).subscribe((l: any) => {
                this.ClienteId = l.data[0].id;
                this.service.getByTablaId("Archivo", l.data[0].id, "Clientes").subscribe(
                    (datos) => {
                        resolve(datos);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        });
    }

    refrescarTabla() {
        $("#datatable").DataTable().destroy();
        this.listClientesArchivos = signal<Archivo[]>([]);
        this.cargarLista();
    }

    download(base64String: string, name: string, extension: string) {
        this.helperService.showLoading();
        this.service.getById("Cliente", this.ClienteId).subscribe((res) => {
            if (res.status) {
                this.service.getById("Persona", res.data.personaId).subscribe((per: any) => {
                    if (per.status) {
                        setTimeout(() => {
                            this.helperService.hideLoading();
                        }, 200);

                        var fileName = `${name}_${per.data.documento}.${extension}`;

                        // Decodificar el contenido base64
                        const binaryString = window.atob(base64String);
                        const binaryLen = binaryString.length;
                        const bytes = new Uint8Array(binaryLen);
                        for (let i = 0; i < binaryLen; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        // Crear el blob
                        const blob = new Blob([bytes], { type: `application/${extension}` });

                        // Crear la URL del objeto
                        const url = window.URL.createObjectURL(blob);

                        // Crear un enlace <a> en el DOM
                        const a = document.createElement('a');
                        document.body.appendChild(a);
                        a.style.display = 'none';
                        a.href = url;
                        a.download = fileName;

                        // Disparar un evento de clic en el enlace
                        a.click();

                        // Liberar recursos
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                });
            }
        });
    }

    openInNewTab(base64String: string, extension: string) {
        this.helperService.showLoading();
        // Decodificar el contenido base64
        const binaryString = window.atob(base64String);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Establecer el tipo MIME basado en la extensión
        let mimeType = '';
        switch (extension.toLowerCase()) {
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            default:
                console.error('Extension de archivo no compatible');
                return;
        }

        // Crear el blob
        const blob = new Blob([bytes], { type: mimeType });

        // Crear la URL del objeto
        const url = window.URL.createObjectURL(blob);

        setTimeout(() => {
            this.helperService.hideLoading();
        }, 200);
        // Abrir el archivo en una nueva pestaña
        window.open(url, '_blank');

        // Liberar recursos
        window.URL.revokeObjectURL(url);
    }

    deleteGeneric(id: any) {
        this.helperService.confirmDelete(() => {
            this.service.delete("Archivo", id).subscribe(
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
    onChangeFile(event: any) {
        const file: File = event.target.files[0];
        this.convertToBase64(file).then((base64Content: string) => {
            this.content = base64Content;
        }).catch((error: any) => {
            this.helperService.showMessage(MessageType.ERROR, error);
        });
    }

    save() {
        if (this.frmArchivosClientes.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        this.helperService.showLoading();
        let data = {
            Nombre: this.frmArchivosClientes.controls["Nombre"].value,
            TablaId: this.ClienteId,
            Tabla: 'Clientes',
            Extension: "pdf",
            Content: this.content,
            Activo: true,
        };

        if (this.content != "") {
            this.service.save("Archivo", 0, data).subscribe(
                (response) => {
                    if (response.status) {
                        this.helperService.showMessage(MessageType.SUCCESS, "Archivo guardado correctamente.");
                        this.frmArchivosClientes.reset();
                        this.refrescarTabla();

                        setTimeout(() => {
                            this.helperService.hideLoading();
                        }, 200);
                    }
                },
                (error) => {
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                    this.frmArchivosClientes.reset();
                    this.helperService.showMessage(MessageType.WARNING, error);
                }
            );
        } else {
            setTimeout(() => {
                this.helperService.hideLoading();
            }, 200);
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
        }
    }
}