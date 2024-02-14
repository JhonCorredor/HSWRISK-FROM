import { Formulario } from './formulario.model';

export interface MenuItem {
  id: number;
  nombre: string;
  activo: boolean;
  createAt: Date;
  formularios: Formulario[];
  modulos: []
  icono: string;
  isCollapsed?: any;
}