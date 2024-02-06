import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-cover',
	templateUrl: './cover.component.html',
	styleUrls: ['./cover.component.scss'],
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {
	// Login Form
	loginForm!: UntypedFormGroup;
	submitted = false;
	fieldTextType!: boolean;
	error = '';
	returnUrl!: string;
	// set the current year
	year: number = new Date().getFullYear();
	// Carousel navigation arrow show
	showNavigationArrows: any;

	constructor(private formBuilder: UntypedFormBuilder, private router: Router) {}

	ngOnInit(): void {
		/**
		 * Form Validatyion
		 */
		this.loginForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			password: ['', Validators.required],
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}

	/**
	 * Form submit
	 */
	onSubmit() {
		this.submitted = true;
		this.router.navigate(['/dashboard']);

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}
	}

	/**
	 * Password Hide/Show
	 */
	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}
}
