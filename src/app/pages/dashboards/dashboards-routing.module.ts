import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { GeneralParameterIndexComponent } from './general-parameter/general-parameter-index/general-parameter-index.component';
import { GeneralParameterKeyIndexComponent } from './general-paremeter-key/general-parameter-key-index/general-parameter-key-index.component';
import { ModulosIndexComponent } from './security/modulos/modulos-index/modulos-index.component';
import { FormulariosIndexComponent } from './security/formularios/formularios-index/formularios-index.component';
import { RolesIndexComponent } from './security/roles/roles-index/roles-index.component';
import { RolesFormComponent } from './security/roles/roles-form/roles-form.component';
import { PersonasIndexComponent } from './security/personas/personas-index/personas-index.component';
import { UsuariosIndexComponent } from './security/usuarios/usuarios-index/usuarios-index.component';
import { UsuariosFormComponent } from './security/usuarios/usuarios-form/usuarios-form.component';
import { EmpresaIndexComponent } from './parameters/empresa/empresa-index/empresa-index.component';
import { EmpresaFormComponent } from './parameters/empresa/empresa-form/empresa-form.component';
import { EmpleadosIndexComponent } from './parameters/empleados/empleados-index/empleados-index.component';
import { EmpleadosFormComponent } from './parameters/empleados/empleados-form/empleados-form.component';
import { ClientesIndexComponent } from './parameters/clientes/clientes-index/clientes-index.component';
import { ClientesFormComponent } from './parameters/clientes/clientes-form/clientes-form.component';
import { CursosIndexComponent } from './operational/cursos/cursos-index/cursos-index.component';
import { CursosFormComponent } from './operational/cursos/cursos-form/cursos-form.component';
import { SalonesIndexComponent } from './operational/salones/salones-index/salones-index.component';
import { ContingenciasIndexComponent } from './operational/contingencias/contingencias-index/contingencias-index.component';
import { InscripcionesIndexComponent } from './operational/inscripciones/inscripciones-index/inscripciones-index.component';
import { IncripcionesFormComponent } from './operational/inscripciones/inscripciones-form/inscripciones-form.component';
import { ConfiguracionesFormComponent } from './parameters/configuraciones/configuraciones-form/configuraciones-form.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  },

  //Modulos
  { path: 'seguridad/modulos', component: ModulosIndexComponent },

  //Formularios
  { path: 'seguridad/formularios', component: FormulariosIndexComponent },

  //Roles
  { path: 'seguridad/roles', component: RolesIndexComponent },
  { path: 'seguridad/roles/crear', component: RolesFormComponent },
  { path: 'seguridad/roles/editar/:id', component: RolesFormComponent },

  //Personas
  { path: 'seguridad/personas', component: PersonasIndexComponent },

  //Usuarios
  { path: 'seguridad/usuarios', component: UsuariosIndexComponent },
  { path: 'seguridad/usuarios/crear', component: UsuariosFormComponent },
  { path: 'seguridad/usuarios/editar/:id', component: UsuariosFormComponent },


  //Empresa
  { path: 'operativo/empresa', component: EmpresaIndexComponent },
  { path: 'operativo/empresa/crear', component: EmpresaFormComponent },
  { path: 'operativo/empresa/editar/:id', component: EmpresaFormComponent },

  //Empleados
  { path: 'parametros/empleados', component: EmpleadosIndexComponent },
  { path: 'parametros/empleados/crear', component: EmpleadosFormComponent },
  { path: 'parametros/empleados/editar/:id', component: EmpleadosFormComponent },

  //Cliente
  { path: 'parametros/clientes', component: ClientesIndexComponent },
  { path: 'parametros/clientes/crear', component: ClientesFormComponent },
  { path: 'parametros/clientes/editar/:id', component: ClientesFormComponent },

  //Cursos
  { path: 'operativo/cursos', component: CursosIndexComponent },
  { path: 'operativo/cursos/crear', component: CursosFormComponent },
  { path: 'operativo/cursos/editar/:id', component: CursosFormComponent },

  //Salones
  { path: 'operativo/salones', component: SalonesIndexComponent },

  //Contingencias
  { path: 'operativo/contingencias', component: ContingenciasIndexComponent },

  //Inscripcion
  { path: 'operativo/inscripciones', component: InscripcionesIndexComponent },
  { path: 'operativo/inscripciones/crear', component: IncripcionesFormComponent },
  { path: 'operativo/inscripciones/editar/:id', component: IncripcionesFormComponent },

  //Configuraciones
  { path: 'parametros/configuraciones/editar/:id', component: ConfiguracionesFormComponent },


  //General
  {
    path: 'parametros/cargos',
    component: GeneralParameterIndexComponent,
    data: {
      ruta: 'Cargos',
      titulo: 'Cargo',
      modulo: 'Parametros',
      iconModule: 'fa-duotone fa-gears',
      iconForm: 'fa-duotone fa-users-gear',
    },
  },
  {
    path: 'parametros/paises',
    component: GeneralParameterIndexComponent,
    data: {
      ruta: 'Paises',
      titulo: 'Pais',
      modulo: 'Parametros',
      iconModule: 'fa-duotone fa-gears',
      iconForm: 'fa-duotone fa-earth-americas',
    },
  },
  {
    path: 'parametros/tiposEstados',
    component: GeneralParameterIndexComponent,
    data: {
      ruta: 'TiposEstados',
      titulo: 'TipoEstado',
      modulo: 'Parametros',
      iconModule: 'fa-duotone fa-gears',
      iconForm: 'fa-duotone fa-bars',
    },
  },
  {
    path: 'operativo/arl',
    component: GeneralParameterIndexComponent,
    data: {
      ruta: 'Arl',
      titulo: 'Arl',
      modulo: 'Operativo',
      iconModule: 'fa-duotone fa-shop',
      iconForm: 'fa-duotone fa-user-helmet-safety',
    },
  },
  {
    path: 'operativo/jornada',
    component: GeneralParameterIndexComponent,
    data: {
      ruta: 'Jornadas',
      titulo: 'Jornada',
      modulo: 'Operativo',
      iconModule: 'fa-duotone fa-shop',
      iconForm: 'fa-duotone fa-user-clock',
    },
  },
  {
    path: 'operativo/nivel',
    component: GeneralParameterIndexComponent,
    data: {
      ruta: 'Niveles',
      titulo: 'Nivel',
      modulo: 'Operativo',
      iconModule: 'fa-duotone fa-shop',
      iconForm: 'fa-duotone fa-layer-group',
    },
  },

  //General key
  {
    path: 'parametros/ciudades',
    component: GeneralParameterKeyIndexComponent,
    data: {
      ruta: 'Ciudades',
      titulo: 'Ciudad',
      modulo: 'Parametros',
      iconModule: 'fa-duotone fa-gears',
      iconForm: 'fa-duotone fa-city',
      key: 'Departamento',
    },
  },
  {
    path: 'parametros/departamentos',
    component: GeneralParameterKeyIndexComponent,
    data: {
      ruta: 'Departamentos',
      titulo: 'Departamento',
      modulo: 'Parametros',
      iconModule: 'fa-duotone fa-gears',
      iconForm: 'fa-duotone fa-map-location-dot',
      key: 'Pais',
    },
  },
  {
    path: 'parametros/estados',
    component: GeneralParameterKeyIndexComponent,
    data: {
      ruta: 'Estados',
      titulo: 'Estado',
      modulo: 'Parametros',
      iconModule: 'fa-duotone fa-gears',
      iconForm: 'fa-duotone fa-sliders',
      key: 'TipoEstado',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardsRoutingModule { }
