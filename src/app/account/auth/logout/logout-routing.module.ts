import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { CoverComponent } from './cover/cover.component';

const routes: Routes = [
	{
		path: 'cover',
		component: CoverComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LogoutRoutingModule {}
