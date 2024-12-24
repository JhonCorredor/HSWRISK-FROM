import { Base } from '../../../../generic/base.module';

export interface Persona extends Base {
  tipoDocumento: string;
  documento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  direccion: string;
  telefono: string;
  email: string;
  genero: number;
  ciudad: string;
  countryBirth: string;
  dateBirth:Date;
  ciudadId: number;
}