import { Base } from '../../../../generic/base.module'

export interface Empleado extends Base {
    codigo: string;
    personaId: number;
    persona: string;
    empresaId: number;
    empresa: string;
    cargoId: number;
    cargo: string;
}