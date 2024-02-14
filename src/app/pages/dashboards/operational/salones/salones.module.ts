import { Generic } from '../../../../generic/generic.module';

export interface Salon extends Generic {
    aforo: number;
    contingenciaId: number;
    contingencia: string;
    estadoId: number;
    estado: string;
    ciudadId: number;
    ciudad: string;
}