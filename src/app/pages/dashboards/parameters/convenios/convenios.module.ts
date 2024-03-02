import { Generic } from '../../../../generic/generic.module';

export interface Convenio extends Generic {
  valor: number;
  fechaInicio: Date;
  fechaFin: Date;
}
