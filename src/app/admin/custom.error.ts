// import {ErrorMessage} from "ng-bootstrap-form-validation";

// export const CUSTOM_ERRORS: ErrorMessage[] = [
//   {
//     error: "required",
//     format: requiredFormat
//   }, {
//     error: "email",
//     format: emailFormat
//   },
//   {
//     error: "futuro",
//     format: futuroFormat
//   },
//   {
//     error: "pattern",
//     format: patternFormat
//   },
//   {
//     error: "minlength",
//     format: minLengthFormat
//   },
//   {
//     error: "maxlength",
//     format: maxLengthFormat
//   },
//   {
//     error: "min",
//     format: minFormat
//   },
//   {
//     error: "max",
//     format: maxFormat
//   }
// ];

// export function requiredFormat(error: any): string {
//      return 'Se requiere el campo';
// }

// export function emailFormat(error: any): string {
//   return 'La dirección de correo electrónico no es válida';
// }

// export function futuroFormat(label: string, error: string): string
// {
//   return `${label} debe ser mayor a ${error}`;
// }

// export function patternFormat(label: string, error: string): string
// {
//   return `No cumple el formato establecido`;
// }

// export function minLengthFormat(label: string, error: any): string
// {
//   return `El campo debe tener al menos ${error.requiredLength} caracteres`;
// }

// export function maxLengthFormat(label: string, error: any): string
// {
//   return `El campo debe tener máximo ${error.requiredLength} caracteres`;
// }

// export function minFormat(label: string, error: any): string
// {
//   return `El campo no debe ser menor a ${error.min}`;
// }

// export function maxFormat(label: string, error: any): string
// {
//   return `El campo no debe ser mayor a ${error.min}`;
// }