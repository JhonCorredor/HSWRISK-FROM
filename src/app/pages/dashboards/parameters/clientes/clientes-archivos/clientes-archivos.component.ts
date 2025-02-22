import { Component, Input, OnInit, signal } from '@angular/core';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { Archivo } from './archivos.module';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-clientes-archivos',
    standalone: false,
    templateUrl: './clientes-archivos.component.html',
    styleUrl: './clientes-archivos.component.css'
})
export class ClientesArchivosComponent implements OnInit {
    @Input() ClienteId: any = null;
    frmArchivosClientes: FormGroup;
    statusForm: boolean = true;
    listClientesArchivos = signal<Archivo[]>([]);
    contentDocumento: string = "";
    contentEps: string = "";
    botones = ['btn-guardar'];

    constructor(
        private helperService: HelperService,
        private service: GeneralParameterService
    ) {
        this.frmArchivosClientes = new FormGroup({
            DocumentoIdentidad: new FormControl(null),
            Pago: new FormControl(null),
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
        return new Promise((resolve, reject) => {
            this.service.getByTablaId("Archivo", this.ClienteId, "Clientes").subscribe(
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

                        var fileName = "";
                        switch (name) {
                            case "Documento de Identidad":
                                fileName = `CC_${per.data.documento}.${extension}`;
                                break;
                            case "Soporte de Pago":
                                fileName = `SOPORTE_PAGO_${per.data.documento}.${extension}`;
                                break;
                        }

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

    CertificadoBancario() {
        Swal.fire(`<h2>Datos Bancarios</h2>
                    <h5>SAFETY, HEALTH AND WORK RISK CONSULTANTS</h5>
                    <h5>NIT: 901202775</h5>
                    <h5>BANCOLOMBIA</h5>
                    <h5>CUENTA DE AHORROS</h5>
                    <h5>No. Producto: 74100008650</h5>`);
    }

    //Events Input
    onChangeDocumento(event: any) {
        this.helperService.showLoading();
        if (typeof event != "undefined") {
            this.service.getById("Cliente", this.ClienteId).subscribe((res) => {
                if (res.status) {
                    this.service.getById("Persona", res.data.personaId).subscribe((per: any) => {
                        if (per.status) {
                            setTimeout(() => {
                                this.helperService.hideLoading();
                            }, 200);

                            const file: File = event.target.files[0];
                            this.convertToBase64(file).then((base64Content: string) => {
                                this.contentDocumento = base64Content;
                            }).catch((error: any) => {
                                this.helperService.showMessage(MessageType.ERROR, error);
                            });

                            // const nombreArchivo = event.target.files[0].name;
                            // const documentoValue = per.data.documento;
                            // Verificar si el nombre del archivo cumple con el formato esperado
                            // if (!(nombreArchivo.startsWith("CC") && nombreArchivo.includes(`${documentoValue}.pdf`))) {
                            //     this.helperService.showMessage(MessageType.WARNING, "El nombre del documento no es el correcto!");
                            //     this.frmArchivosClientes.controls["DocumentoIdentidad"].setValue(null);
                            // } else {

                            // }
                        }
                    });
                }
            });
        }
    }

    onChangeSoporte(event: any) {
        this.helperService.showLoading();
        if (typeof event != "undefined") {
            this.service.getById("Cliente", this.ClienteId).subscribe((res) => {
                if (res.status) {
                    this.service.getById("Persona", res.data.personaId).subscribe((per: any) => {
                        if (per.status) {
                            setTimeout(() => {
                                this.helperService.hideLoading();
                            }, 200);

                            const file: File = event.target.files[0];
                            this.convertToBase64(file).then((base64Content: string) => {
                                this.contentEps = base64Content;
                            }).catch((error: any) => {
                                this.helperService.showMessage(MessageType.ERROR, error);
                            });
                        }
                    });
                }
            });
        }
    }

    save() {
        let data = {
            Nombre: "",
            TablaId: this.ClienteId,
            Tabla: 'Clientes',
            Extension: "pdf",
            Content: "",
            Activo: true,
        };
        this.helperService.showLoading();
        //Guardo el documento de identidad
        if (this.contentDocumento != "") {
            data.Nombre = "Documento de Identidad";
            data.Content = this.contentDocumento;
            this.service.save("Archivo", 0, data).subscribe(
                (response) => {
                    if (response.status) {
                        setTimeout(() => {
                            this.helperService.hideLoading();
                        }, 200);
                        this.helperService.showMessage(MessageType.SUCCESS, "Documento de identidad guardado correctamente.");
                        this.frmArchivosClientes.reset();
                        this.refrescarTabla();
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
                    this.frmArchivosClientes.reset();
                    this.helperService.showMessage(MessageType.WARNING, error);
                }
            );
        }

        if (this.contentEps != "") {
            //Guardo el documento de la eps
            data.Nombre = "Soporte de Pago";
            data.Content = this.contentEps;
            data.Extension = "jpg";
            this.service.save("Archivo", 0, data).subscribe(
                (response) => {
                    if (response.status) {
                        setTimeout(() => {
                            this.helperService.hideLoading();
                        }, 200);
                        this.helperService.showMessage(MessageType.SUCCESS, "Soporte de Pago guardado correctamente.");
                        this.frmArchivosClientes.reset();
                        this.refrescarTabla();
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
                    this.frmArchivosClientes.reset();
                    this.helperService.showMessage(MessageType.WARNING, error);
                }
            );
        }
    }
}