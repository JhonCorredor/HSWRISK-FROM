import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { JobComponent } from './job/job.component';

const routes: Routes = [
	{
		path: '',
		component: JobComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LandingRoutingModule {}
