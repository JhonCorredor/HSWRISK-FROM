import { Base } from '../../../../generic/base.module';

export interface Empresa extends Base {
  razonSocial: string;
  nit: string;
  direccion: string;
  telefono: number;
  email: number;
  web: number;
  ciudadId: number;
}
