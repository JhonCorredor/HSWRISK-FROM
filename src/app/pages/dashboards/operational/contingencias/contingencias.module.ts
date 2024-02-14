import { Generic } from '../../../../generic/generic.module';

export interface Contingencia extends Generic {
    norma: string;
    porcentajeAforo: number;
}