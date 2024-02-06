import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { CoverComponent } from './cover/cover.component';
import { DashboardComponent } from '../../../pages/dashboards/dashboard/dashboard.component';

const routes: Routes = [
	{
		path: 'cover',
		component: CoverComponent,
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SigninRoutingModule {}
