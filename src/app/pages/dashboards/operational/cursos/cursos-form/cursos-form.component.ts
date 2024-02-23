import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CursosDetallesComponent } from '../../cursos-detalles/cursos-detalles.component';

@Component({
    selector: 'app-cursos-form',
    standalone: false,
    templateUrl: './cursos-form.component.html',
    styleUrl: './cursos-form.component.css'
})
export class CursosFormComponent implements OnInit {
    frmCursos: FormGroup;
    statusForm: boolean = true
    id!: number;
    botones = ['btn-guardar', 'btn-cancelar'];
    title = "";
    breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Operativo', icon: 'fa-duotone fa-shop' }, { name: 'Curso', icon: "fa-duotone fa-person-chalkboard" }, { name: 'Crear', icon: "fa-duotone fa-octagon-plus" }];

    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
    ) {
        this.frmCursos = new FormGroup({
            Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            Norma: new FormControl(null, [Validators.required]),
            Descripcion: new FormControl(null, [Validators.required, Validators.maxLength(370)]),
            Url: new FormControl(null, [Validators.required]),
            Activo: new FormControl(true, Validators.required),
        });
        this.routerActive.params.subscribe((l) => (this.id = l['id']));
    }

    ngOnInit(): void {
        if (this.id != undefined && this.id != null) {
            this.title = `Editar Curso`;
            this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: 'Operativo', icon: 'fa-duotone fa-shop' }, { name: 'Curso', icon: "fa-duotone fa-person-chalkboard" }, { name: 'Editar', icon: "fa-duotone fa-pen-to-square" }];
            this.service.getById("Curso", this.id).subscribe(l => {
                this.frmCursos.controls['Codigo'].setValue(l.data.codigo);
                this.frmCursos.controls['Nombre'].setValue(l.data.nombre);
                this.frmCursos.controls['Norma'].setValue(l.data.norma);
                this.frmCursos.controls['Descripcion'].setValue(l.data.descripcion);
                this.frmCursos.controls['Url'].setValue(l.data.url);
                this.frmCursos.controls['Activo'].setValue(l.data.activo);
            })
        } else {
            this.title = `Crear Curso`;
        }
    }

    save() {
        if (this.frmCursos.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        let data = {
            id: this.id ?? 0,
            ...this.frmCursos.value,
        };
        this.service.save("Curso", this.id, data).subscribe(
            (response) => {
                if (response.status) {
                    this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
                    this.helperService.redirectApp(`dashboard/operativo/cursos/editar/${response.data.id}`);
                }
            },
            (error) => {
                this.helperService.showMessage(MessageType.ERROR, error);
            }
        )
    }

    cancel() {
        this.helperService.redirectApp('dashboard/operativo/cursos');
    }
}

@NgModule({
    declarations: [
        CursosFormComponent,
        CursosDetallesComponent
    ],
    imports: [
        CommonModule,
        GeneralModule,
        NgbNavModule
    ]
})
export class CursosFormModule { }