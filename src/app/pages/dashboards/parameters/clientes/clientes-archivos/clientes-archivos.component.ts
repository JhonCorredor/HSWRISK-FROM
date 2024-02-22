import { Component, Input, OnInit, signal } from '@angular/core';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { Archivo } from './archivos.module';

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
            Eps: new FormControl(null),
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
                            case "Eps":
                                fileName = `EPS_${per.data.documento}.${extension}`;
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
                        const blob = new Blob([bytes], { type: 'application/pdf' });

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

        // Crear el blob
        const blob = new Blob([bytes], { type: `application/${extension}` });

        // Crear la URL del objeto
        const url = window.URL.createObjectURL(blob);

        setTimeout(() => {
            this.helperService.hideLoading();
        }, 200);
        // Abrir el PDF en una nueva pestaña
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
                            const nombreArchivo = event.target.files[0].name;
                            const documentoValue = per.data.documento;

                            // Verificar si el nombre del archivo cumple con el formato esperado
                            if (!(nombreArchivo.startsWith("CC") && nombreArchivo.includes(`${documentoValue}.pdf`))) {
                                this.helperService.showMessage(MessageType.WARNING, "El nombre del documento no es el correcto!");
                                this.frmArchivosClientes.controls["DocumentoIdentidad"].setValue(null);
                            } else {
                                const file: File = event.target.files[0];
                                this.convertToBase64(file).then((base64Content: string) => {
                                    this.contentDocumento = base64Content;
                                }).catch((error: any) => {
                                    this.helperService.showMessage(MessageType.ERROR, error);
                                });
                            }
                        }
                    });
                }
            });
        }
    }

    onChangeEps(event: any) {
        this.helperService.showLoading();
        if (typeof event != "undefined") {
            this.service.getById("Cliente", this.ClienteId).subscribe((res) => {
                if (res.status) {
                    this.service.getById("Persona", res.data.personaId).subscribe((per: any) => {
                        if (per.status) {
                            setTimeout(() => {
                                this.helperService.hideLoading();
                            }, 200);

                            const nombreArchivo = event.target.files[0].name;
                            const documentoValue = per.data.documento;

                            // Verificar si el nombre del archivo cumple con el formato esperado
                            if (!(nombreArchivo.startsWith("EPS") && nombreArchivo.includes(`${documentoValue}.pdf`))) {
                                this.helperService.showMessage(MessageType.WARNING, "El nombre del documento no es el correcto!");
                                this.frmArchivosClientes.controls["Eps"].setValue(null);
                            } else {
                                const file: File = event.target.files[0];
                                this.convertToBase64(file).then((base64Content: string) => {
                                    this.contentEps = base64Content;
                                }).catch((error: any) => {
                                    this.helperService.showMessage(MessageType.ERROR, error);
                                });
                            }
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

        //Guardo el documento de identidad
        if (this.contentDocumento != "") {
            data.Nombre = "Documento de Identidad";
            data.Content = this.contentDocumento;
            this.service.save("Archivo", 0, data).subscribe(
                (response) => {
                    if (response.status) {
                        this.helperService.showMessage(MessageType.SUCCESS, "Documento de identidad guardado correctamente.");
                        this.frmArchivosClientes.reset();
                        this.refrescarTabla();
                    }
                },
                (error) => {
                    this.frmArchivosClientes.reset();
                    this.helperService.showMessage(MessageType.WARNING, error);
                }
            );
        }

        if (this.contentEps != "") {
            //Guardo el documento de la eps
            data.Nombre = "Eps";
            data.Content = this.contentEps;

            this.service.save("Archivo", 0, data).subscribe(
                (response) => {
                    if (response.status) {
                        this.helperService.showMessage(MessageType.SUCCESS, "Documento de la Eps guardado correctamente.");
                        this.frmArchivosClientes.reset();
                        this.refrescarTabla();
                    }
                },
                (error) => {
                    this.frmArchivosClientes.reset();
                    this.helperService.showMessage(MessageType.WARNING, error);
                }
            );
        }
    }
}