import { Generic } from '../../../../generic/generic.module';

export interface Formulario extends Generic{
  url: string;
  icono: string;
  moduloId: number;
  modulo: string;
}