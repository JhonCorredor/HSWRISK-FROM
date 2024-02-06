import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { SigninRoutingModule } from './signin-routing.module';
import { CoverComponent } from './cover/cover.component';

@NgModule({
	declarations: [CoverComponent],
	imports: [CommonModule, NgbCarouselModule, ReactiveFormsModule, FormsModule, SigninRoutingModule],
})
export class SigninModule {}
