export interface Formulario {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  createAt: Date;
  url: string;
  icono: string;
  moduloId: number;
  isCollapsed?: any;
  collapseid?: any;
}