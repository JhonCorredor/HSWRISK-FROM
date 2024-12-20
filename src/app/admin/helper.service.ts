import { DecimalPipe, Location, formatNumber } from "@angular/common";
import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import Swal from 'sweetalert2';
import { createNumberMask } from "text-mask-addons";
import { GeneralParameterService } from "../generic/general.service";

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(
        private router: Router, public _location: Location,
        private _toast: ToastrService, private _spinner: NgxSpinnerService,
        private service: GeneralParameterService,
        @Inject(LOCALE_ID) private locale: string
    ) { }

    public formaterNumber(number: number) {
        return formatNumber(number, this.locale, '1.0-0');
    }

    formatearNumero(num: string, separdorDecimal: string, separador: string, cantDecimales: number, peso: boolean = true, aproximar: boolean = true) {
        if (aproximar) {
            num = parseFloat(num).toFixed(cantDecimales);
        }
        if (!isNaN(Number(num))) {
            num += '';
            const splitStr = num.split('.');
            let splitLeft = splitStr[0];
            const splitRight = splitStr.length > 1 ? separdorDecimal + splitStr[1].slice(0, cantDecimales) : '';
            const regx = /(\d+)(\d{3})/;

            if (separador != null && separador.trim().length > 0) {
                while (regx.test(splitLeft)) {
                    splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
                }
            }

            if (peso) {
                return '$ ' + splitLeft + splitRight;
            } else {
                return splitLeft + splitRight;
            }
        }
        return '';
    }



    public formatDateToInputUpdateForm(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = date.getDate().toString().padStart(2, '0'); // Día en formato DD
        return `${year}-${month}-${day}`;
      }
    
    
    public getEnum(endPoint: string, bindValue: string, bindLabel: string): Promise<any> {
        var lstDataSelect: any[] = [];

        return new Promise((resolve) => {
            this.service.getEnum(endPoint).subscribe((res) => {
                res.data.forEach((item: any) => {
                    if (bindValue == "" && bindLabel == "") {
                        lstDataSelect.push(
                            {
                                id: item,
                                nombre: item,
                            }
                        );
                    } else {
                        lstDataSelect.push(
                            {
                                id: item[bindValue],
                                nombre: item[bindLabel],
                            }
                        );
                    }
                });

                resolve(lstDataSelect);
            });
        });
    }

    formatearNumeroDB(numero: string) {
        numero = numero.replace(".", "");
        numero = numero.replace(",", ".");
        numero = numero.replace("$", "");
        numero = numero.replace("%", "");
        numero = numero.replace(" ", "");
        return numero;
    }

    redirectApp(url: String) {
        this.router.navigate([url]);
    }

    onClickBack() {
        this._location.back();
    }

   

    confirmDelete(callback: any) {
        Swal.fire({
            title: '¿Está seguro de realizar esta acción?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminelo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        })
    }

    confirmUpdate(callback: any) {
        Swal.fire({
            title: '¿Está seguro de realizar esta acción?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Editar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        })
    }

    viewImage(extesion: any, callbackYes: any, callbackNot: any) {
        // if (extesion === 'png'){
        Swal.fire({
            title: '¿Deseas ver el archivo antes de descargar?',
            // text: "Esta acción no se puede deshacer",
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#3085d6',
            denyButtonColor: '#d33',
            confirmButtonText: 'Si , Ver!',
            cancelButtonText: 'Cancelar',
            denyButtonText: `No , Descargar`,
        }).then((result) => {
            if (result.isConfirmed) {
                callbackYes();
            }
            if (result.isDenied) {
                callbackNot();
            }

        })
        // }else {
        //     callbackNot();
        // }
    }

    showDesicionCustom(title: any, message: any, type: any, callback: any) {
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            showCancelButton: true,
            confirmButtonColor: '#F8E12E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        })
    }

    showMessage(type: string, message: string, title: string = "Mensaje del sistema") {
        switch (type) {
            case MessageType.ERROR:
                this._toast.error(message, title);
                break;
            case MessageType.SUCCESS:
                this._toast.success(message, title);
                break;
            case MessageType.WARNING:
                this._toast.warning(message, title)
                break;
            case MessageType.PROGRESS:
                this._toast.info(message, title)
                break;
            default:
                break;
        }
    }

    showLoading() {
        this._spinner.show()
    }

    hideLoading() {
        setTimeout(() => {
            this._spinner.hide();
        }, 500);
    }

    convertDateUTCToDMA(date: any) {
        let dateSplit = date.split('T')[0].split('-');
        return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
    }

    convertDateTime(date: any) {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    traduccionDatatable() {
        return {
            "decimal": ",",
            "thousands": ".",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoPostFix": "",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "loadingRecords": "Cargando...",
            "lengthMenu": "Mostrar _MENU_  registros por página",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "processing": "Procesando...",
            "search": "Buscar:",
            "searchPlaceholder": "",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "aria": {
                "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            //only works for built-in buttons, not for custom buttons
            "buttons": {
                "create": "Nuevo",
                "edit": "Cambiar",
                "remove": "Borrar",
                "copy": "Copiar",
                "csv": "fichero CSV",
                "excel": "tabla Excel",
                "pdf": "documento PDF",
                "print": "Imprimir",
                "colvis": "Visibilidad columnas",
                "collection": "Colección",
                "upload": "Seleccione fichero...."
            },
            "select": {
                "rows": {
                    _: '%d filas seleccionadas',
                    0: 'clic fila para seleccionar',
                    1: 'una fila seleccionada'
                }
            }
        }
    }

    public capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    mascarasPredeterminadas(mascara: string, regExp = null, texto = null, cantidad = null, control: any = null) {

        let mascaraRetorno;
        switch (mascara) {
            case 'indicativo':
                mascaraRetorno = createNumberMask({
                    prefix: '+',
                    suffix: '',
                    includeThousandsSeparator: false,
                    integerLimit: 10,
                });
                break;
            case 'dinero':
                mascaraRetorno = createNumberMask({
                    prefix: '$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 15
                });
                break;
            case 'dineroInventario': // Mascara uso inventario
                mascaraRetorno = createNumberMask({
                    prefix: '$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 11
                });
                break;
            case 'dineroCompras': // Mascara uso compras
                mascaraRetorno = createNumberMask({
                    prefix: '$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    allowNegative: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 11
                });
                break;
            case 'dineroInventariocon5decimalesPocosEnteros': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '$',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 5,
                    integerLimit: 10
                });
                break;
            case 'dineroInventariocon': // Mascara uso inventario
                mascaraRetorno = createNumberMask({
                    prefix: '$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 20
                });
                break;
            case 'letras':
                mascaraRetorno = this.expresionRegularMask(texto, /[A-Za-zñÑáéíóúÁÉÍÓÚ\s*#+.:'\-]/);
                break;
            case 'buscador':
                mascaraRetorno = this.expresionRegularMask(texto, /[ a-z0-9-/áéíóúüñ,.@]+/);
                break;
            case 'buscadorConMayusculasYEspacio':
                mascaraRetorno = this.expresionRegularMask(texto, /[A-Za-z0-9 ñÁ-Úá-ź]+/);
                break;
            case 'soloLetras':
                mascaraRetorno = this.expresionRegularMask(texto, /[A-Za-zñÑáéíóúÁÉÍÓÚ\s´]/);
                break;
            case 'letrasNumeros':
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-zñÑáéíóúÁÉÍÓÚ\s*#+.:'\-]/);
                break;
            case 'letrasNumerosComa': //usada en academico
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-zñÑáéíóúÁÉÍÓÚ\s*#+.,:'\-]/);
                break;
            case 'letrasNumerosIones':
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-z-]/);
                break;
            case 'alfaNumerico':
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-z ]/);
                break;
            case 'alfaNumericoEspecial': // No borra uso de inventario
                mascaraRetorno = this.expresionRegularMask(texto, /^[0-9a-zA-Z]+$/);
                break;
            case 'alfaNumericoEspecialDatatable': // No borra uso de nomina
                mascaraRetorno = this.expresionRegularMask(texto, /[ a-zA-Z0-9-/áéíóúüñ,.@]+$/);
                break;
            case 'alfaNumericoConTildes': // No borra uso de contratacion
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-zñÑáéíóúÁÉÍÓÚ\s´]/);
                break;
            case 'alfaNumericoNoEspeciales':
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-z\s'\-]/);
                break;
            case 'soloNumeros':
                mascaraRetorno = this.expresionRegularMask(texto, /^[0-9]+$/);
                break;
            case 'soloNumerosMayoresCero':
                mascaraRetorno = this.expresionRegularMask(texto, /^[1-9]+$/);
                break;
            case 'codigo':
                mascaraRetorno = this.codigoMaskExtendido(texto, control);
                break;
            case 'orden':
                mascaraRetorno = this.orden(texto, control);
                break;
            case 'codigoCategoria':
                mascaraRetorno = this.expresionRegularMask(texto, /[0-9A-Za-z]/);
                break;
            case 'descripcion':
                mascaraRetorno = this.mascaraDescripcion(texto);
                break;
            case 'nombre':
                mascaraRetorno = this.mascaraNombre(texto, /[A-Za-z0-9 ()"ñÁ-Úá-ź]+/, cantidad);
                break;
            case 'nombrePLAN':
                mascaraRetorno = this.mascaraNombre(texto, /[A-Za-z0-9 ñÁ-Úá-ź]+/, cantidad);
                break;
            case 'nombrePRE':
                mascaraRetorno = this.mascaraNombre(texto, /[A-Za-z0-9 "ñÁ-Úá-ź]+/, cantidad);
                break;
            case 'nombreAgenda':
                mascaraRetorno = this.mascaraNombre(texto, /[A-Za-záéíóúÁÉÍÓÚñÑ ]+/, cantidad);
                break;
            case 'nombreCGR':
                mascaraRetorno = this.mascaraNombreCGR(texto, control);
                break;
            //Uso de presupuesto e inventario, no eliminar ni modificar
            case 'nombreEstandar':
                mascaraRetorno = this.mascaraNombre(texto, /[A-Za-z0-9 ñÁ-Úá-ź]+/, cantidad);
                break;
            case 'nombreParametros':
                mascaraRetorno = this.mascaraNombre(texto, /[A-Za-z0-9 ()"/_:.ñÁ-Úá-ź\-]+/, cantidad);
                break;
            //Uso de presupuesto, inventario y nomina, no eliminar ni modificar
            case 'num_act':
                mascaraRetorno = this.expresionRegularMaskNumAct(texto, /[0-9]/, cantidad);
                break;
            case 'Uvt':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false,
                    integerLimit: 6
                });
                break;

            case 'Enteros':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: false,
                    integerLimit: cantidad
                });
                break;
            case 'Porcentaje':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '%',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 3
                });
                break;
            case 'Porcentaje_negativo':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '%',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 3,
                    allowNegative: true
                });
                break;
            case 'Porcentaje_3_decimales':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '%',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 3,
                    integerLimit: 2
                });
                break;
            case 'Porcentaje_decimal':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '%',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 3,
                    integerLimit: 2,
                    requireDecimal: true,
                    allowLeadingZeroes: true,
                });
                break;
            case 'Numero': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 20
                });
                break;
            case 'Numero_facturacion': // no borrar uso de facturacion
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '',
                    allowDecimal: false,
                    integerLimit: 8
                });
                break;
            case 'NumeroSinDecimalesFacturacion': // no borrar uso de facturacion
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false,
                    integerLimit: 10
                });
                break;
            case 'Numero_cuenta': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '',
                    allowDecimal: false,
                    integerLimit: 15
                });
                break;
            case 'Numero_4_enteros': // no borrar uso de NOMINA
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: false,
                    integerLimit: 4
                });
                break;
            case 'Numero_15_enteros_2_decimales': // no borrar
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 15
                });
                break;
            case 'Numero_15_enteros_2_decimales_pesos': // no borrar
                mascaraRetorno = createNumberMask({
                    prefix: '$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 15
                });
                break;
            case 'Numero_15_enteros_2_decimales_dolar': // no borrar
                mascaraRetorno = createNumberMask({
                    prefix: 'US$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 15
                });
                break;
            case 'Numero_15_enteros_negativos_2_decimales': // no borrar
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 15,
                    allowNegative: true
                });
                break;
            case 'Numero_15_enteros': // no borrar uso de PRESUPUESTO
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: false,
                    integerLimit: 15
                });
                break;
            case 'Numero_10_enteros': // no borrar uso de PRESUPUESTO
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '',
                    allowDecimal: false,
                    integerLimit: 10
                });
                break;
            case 'Numero_9_enteros': // no borrar uso de PRESUPUESTO
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '',
                    allowDecimal: false,
                    integerLimit: 9
                });
                break;
            case 'NumeroConPocosEnteros': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 11
                });
                break;
            case 'NumeroContenido': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 8
                });
                break;
            case 'NumeroSinDecimales': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false,
                    integerLimit: 20
                });
                break;
            case 'NumeroSinDecimalesPocoEnteros': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false,
                    integerLimit: 8
                });
                break;
            case 'NumeroConOchoEnteros': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: false,
                    integerLimit: 8
                });
                break;
            case 'Temperatura':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '°C',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 3,
                    allowNegative: true
                });
                break;
            case 'Edad':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    decimalLimit: 2,
                    integerLimit: 2
                });
                break;
            case 'EdadProducto':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    decimalLimit: 3,
                    integerLimit: 3
                });
                break;
            case 'Puntos': // no borrar uso de nomina
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 3
                });
                break;
            case 'HorasAcademicas':
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 4,
                    integerLimit: 3
                });
                break;
            case 'NumeroSinDecimalesTesoreria': // no borrar uso de inventario
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false,
                    integerLimit: 6
                });
                break;
            case 'dineroTesoreria': // Mascara uso inventario
                mascaraRetorno = createNumberMask({
                    prefix: '$ ',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 9
                });
                break;
            case 'Numero10SinPunto': // no borrar uso de nomina
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false,
                    integerLimit: 10
                });
                break;
            case 'Numero_4_enteros_2_decimales': // no borrar uso tesoreria
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: true,
                    thousandsSeparatorSymbol: '.',
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 2,
                    integerLimit: 4
                });
                break;
            case 'Numero_5_enteros_4_decimales': // no borrar
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    thousandsSeparatorSymbol: null,
                    allowDecimal: true,
                    decimalSymbol: ',',
                    decimalLimit: 4,
                    integerLimit: 5
                });
                break;
            case 'enteros_sin_seperado_mil': // no borrar
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    thousandsSeparatorSymbol: null,
                    allowDecimal: false,
                    integerLimit: cantidad
                });
                break;
            case 'rangos': // USO NOMINA
                mascaraRetorno = this.expresionRegularMaskNumAct(texto, /^[0-9]+$/, cantidad);
                break;
            default:
                mascaraRetorno = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowLeadingZeroes: true
                });
                break;
        }
        return mascaraRetorno;
    }

    public expresionRegularMask(valor: any, exp: any): RegExp[] {
        const nameMask: RegExp[] = [];
        if (exp != null) {
            for (let i = 0; i <= 500; i++) {
                nameMask.push(exp);
            }
        }
        return nameMask;
    }

    public expresionRegularMaskNumAct(valor: any, exp: any, cantidad: any): RegExp[] {
        const nameMask: RegExp[] = [];
        if (exp != null) {
            for (let i = 1; i <= cantidad; i++) {
                nameMask.push(exp);
            }
        }
        return nameMask;
    }

    public mascaraNombre(valor: any, exp: any, cantidad: any): RegExp[] {
        const nameMask: RegExp[] = [];
        if (exp != null) {
            for (let i = 1; i <= cantidad; i++) {
                nameMask.push(exp);
            }
        }
        return nameMask;
    }

    public mascaraNombreCGR(rawValue: any, control: any): RegExp[] {
        rawValue = rawValue.toUpperCase();
        control.setValue(rawValue);
        const maskStr = /[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ´]/;
        const strLength = 115;
        const nombreCGR: RegExp[] = [];
        for (let i = 1; i <= strLength; i++) {
            nombreCGR.push(maskStr);
        }
        return nombreCGR;
    }

    codigoMaskExtendido(rawValue: any, control: any): RegExp[] {

        rawValue = rawValue ? rawValue.toUpperCase() : null;
        control.setValue(rawValue);
        const maskStr = /[A-Za-z0-9]/;
        const strLength = 20;
        const codigoMask: RegExp[] = [];
        for (let i = 1; i <= strLength; i++) {
            codigoMask.push(maskStr);
        }
        return codigoMask;
    }

    orden(rawValue: any, control: any): RegExp[] {
        rawValue = rawValue ? rawValue.toUpperCase() : null;
        control.setValue(rawValue);
        const maskStr = /^[0-9]+$/;
        const strLength = 2;
        const codigoMask: RegExp[] = [];
        for (let i = 1; i <= strLength; i++) {
            codigoMask.push(maskStr);
        }
        return codigoMask;
    }

    public mascaraDescripcion(valor: any) {
        const arregloDescripcion: any = [];
        let cant: any = 0;
        let arregloLength: any;
        const descripcion = valor.split(' ');
        descripcion.forEach((element: any) => {
            if (element != '') {
                arregloDescripcion.push(element);
                cant += element.length;
            }

        });
        arregloLength = arregloDescripcion.length;
        return { 'cantPalabra': arregloLength, 'cantCaracteres': cant };
    }

    public downloadFile(data: any) {
        const linkSource = `${data.archivo}`;
        const downloadLink = document.createElement("a");
        const fileName = `${data.nombre}`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click()
    }

    showMessageError(response: any) {
        if (response && response.status == 500) {
            this.showMessage(MessageType.ERROR, response.error.message);
        } else {
            this.showMessage(MessageType.ERROR, response.message);
        }
    }
}





export const MessageType = {
    SUCCESS: "S",
    WARNING: "W",
    ERROR: "E",
    PROGRESS: "P"
}

export const Messages = {
    SAVESUCCESS: "Registro guardado",
    SAVEERROR: "Error al guardar",
    UPDATESUCCESS: "Registro actualizado",
    UPDATEERROR: "Error al actualizar",
    DELETESUCCESS: "Registro eliminado",
    DELETEERROR: "Error al eliminar",
    EMPTYFIELD: "Faltan campos por llenar",
    INVALIDUSER: "Usuario o contraseña incorrectos",
    INVALIDOPERATION: "Operación no permitida",
    INVALIDPASSWORD: "Contraseñas no coinciden",
    EXPIREDSESION: "Su sesion ha expirado, ingrese nuevamente",
    DELETEFACTURE: "No se puede eliminar una factura aprobada",
    UPDATEFACTURE: "No se puede editar una factura aprobada",
    INVALIDFILE: "Archivo no permitido",
    SAVEFILE: "Archivo cargado exitosamente",
    PROGRESS: "Procesando Datos, Espere por favor...",
}
