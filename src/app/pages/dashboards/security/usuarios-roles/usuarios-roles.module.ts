import { Base } from '../../../../generic/base.module';

export interface UsuarioRol extends Base {
    usuarioId: number;
    usuario: string;
    rolId: number;
    rol: string;
}