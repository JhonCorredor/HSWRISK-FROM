import { Base } from '../../../../generic/base.module';

export interface Inscripcion extends Base {
    codigo: string;
    fechaCertificacion: Date;
    usuarioRegistro: string;
    clienteId: string;
    cliente: string;
    estadoId: string;
    estado: string;
    cursoDetalleId: string;
    cursoDetalle: string;
}