import { Base } from '../../../../generic/base.module';

export interface Cliente extends Base {
  codigo: string;
  tipoCliente: string;
  nivelEducativo: string;
  cargoActual: string;
  areaTrabajo: string;
  lectoEscritura: string;
  rh: string;
  enfermedades: string;
  alergias: string;
  medicamentos: string;
  lesiones: string;
  acudiente: string;
  telefonoAcudiente: string;
  personaId: number;
  persona: string;
  arlId: number;
  arl: string;
  empresaId: number;
  empresa: string;
}
