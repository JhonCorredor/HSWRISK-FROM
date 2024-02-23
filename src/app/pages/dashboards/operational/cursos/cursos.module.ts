import { Generic } from '../../../../generic/generic.module';

export interface Curso extends Generic {
    descripcion: string;
    norma: string;
    url: string;
}