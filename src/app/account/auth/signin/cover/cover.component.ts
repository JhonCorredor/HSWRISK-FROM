import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService, Messages, MessageType } from '../../../../admin/helper.service';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { UsuariosService } from '../../../usuarios.service';
import { Usuario } from '../../../usuarios.module';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-cover',
	templateUrl: './cover.component.html',
	styleUrls: ['./cover.component.scss'],
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {
	fieldTextType!: boolean;
	frmLogin;
	localStorage = localStorage;
	submitted = false;
	error = '';
	returnUrl!: string;
	// set the current year
	year: number = new Date().getFullYear();
	// Carousel navigation arrow show
	showNavigationArrows: any;
	user = signal<Usuario>({
		id: 0,
		activo: true,
		userName: "",
		password: "",
		personaId: 0,
		persona: ""
	})

	constructor(
		public router: Router,
		public _helperService: HelperService,
		private service: UsuariosService,
		private authenticationService: AuthenticationService,

	) {
		this.frmLogin = new FormGroup({
			UserName: new FormControl('', Validators.required),
			Password: new FormControl('', Validators.required),
			Remember: new FormControl(false)
		});

		// redirect to home if already logged in
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/dashboard/operativo/inscripciones']);
		}
	}

	ngOnInit(): void {
		if (sessionStorage.getItem('currentUser')) {
			this.router.navigate(['/dashboard/operativo/inscripciones']);
		}

		if (document.cookie.indexOf("userName") > -1 && document.cookie.indexOf("password") > -1) {
			this.frmLogin.controls.UserName.setValue(document.cookie.split("userName=")[1].split(";")[0]);
			this.frmLogin.controls.Password.setValue(document.cookie.split("password=")[1].split(";")[0]);
			this.frmLogin.controls.Remember.setValue(true);
		}
	}

	recordar() {
		let isChecked = this.frmLogin.controls.Remember.value;
		this.user.set({
			id: null,
			activo: null,
			userName: this.frmLogin.controls.UserName.value,
			password: this.frmLogin.controls.Password.value,
			personaId: null,
			persona: ""
		});
		if (isChecked) {
			let date = (new Date().getFullYear()) + 1;
			document.cookie = `userName=${this.user().userName}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
			document.cookie = `password=${this.user().password}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
		}
		else {
			let date = (new Date().getFullYear()) - 1;
			document.cookie = `userName=${this.user().userName}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
			document.cookie = `password=${this.user().password}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
		}
	}

	updateUser(userName: any, password: any) {
		this.user.set({
			id: null,
			activo: null,
			userName: userName,
			password: password,
			personaId: null,
			persona: ""
		});
	}

	async iniciarSesion() {

		if (this.frmLogin.invalid) {
			this._helperService.showMessage(MessageType.WARNING, "Existen campos vacíos");
			return
		}

		this._helperService.showLoading();

		this.updateUser(this.frmLogin.controls.UserName.value, this.frmLogin.controls.Password.value);

		this.service.Authenticate(this.user()).subscribe((res: any) => {
			this._helperService.hideLoading();
			if (res.status && res.status == true) {
				this.submitted = true;
				this.recordar();
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("menu", JSON.stringify(res.data.menus));
				localStorage.setItem("userId", JSON.stringify(res.data.user.id));
				localStorage.setItem("userName", res.data.user.persona);
				localStorage.setItem("persona_Id", res.data.user.personaId);
				sessionStorage.setItem('toast', 'true');
				sessionStorage.setItem('currentUser', JSON.stringify(res.data));
				sessionStorage.setItem('token', res.data.token);
				this.router.navigate(['/dashboard/operativo/inscripciones']);
			}
		}, (error: any) => {
			this._helperService.hideLoading();
			setTimeout(() => {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: error,
				});
			}, 700);
		});
	}

	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}

	get f() {
		return this.frmLogin.controls;
	}
}
