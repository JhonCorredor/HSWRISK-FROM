import { Base } from '../../../../generic/base.module';

export interface CursoDetalle extends Base {
    precio: number;
    duracion: number;
    fechaInicio: Date;
    fechaFin: Date;
    virtual: boolean;
    cursoId: number;
    empleadoId: number;
    estadoId: number;
    salonId: number;
    nivelId: number;
    jornadaId: number;
    curso: string;
    empleado: string;
    estado: string;
    salon: string;
    nivel: string;
    jornada: string;
}