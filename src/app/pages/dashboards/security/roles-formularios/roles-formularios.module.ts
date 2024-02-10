import { Base } from '../../../../generic/base.module';

export interface RolFormulario extends Base {
    formularioId: number;
    formulario: string;
    rolId: number;
    rol: string;
}