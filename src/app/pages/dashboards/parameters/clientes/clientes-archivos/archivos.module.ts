import { Base } from '../../../../../generic/base.module';

export interface Archivo extends Base {
    nombre: string;
    tablaId: number;
    tabla: string;
    extension: string;
    content: string;
}