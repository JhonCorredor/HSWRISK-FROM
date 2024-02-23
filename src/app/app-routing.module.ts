import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

//Inscripcion
import { InscripcionesComponent } from './inscripciones/inscripciones.component';
//Certificado
import { CertificadosComponent } from './certificados/certificados.component';
//Academia
import { AcademiaComponent } from './academia/academia.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
	{
		path: 'dashboard',
		component: LayoutComponent,
		loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
		canActivate: [AuthGuard],
	},
	{ path: 'auth', loadChildren: () => import('./account/account.module').then((m) => m.AccountModule) },
	{
		path: 'pages',
		loadChildren: () => import('./extraspages/extraspages.module').then((m) => m.ExtraspagesModule),
		canActivate: [AuthGuard],
	},

	{ path: '', loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule) },

	{ path: 'inscripcion', component: InscripcionesComponent },
	{ path: 'certificados', component: CertificadosComponent },
	{ path: 'academia', component: AcademiaComponent },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
