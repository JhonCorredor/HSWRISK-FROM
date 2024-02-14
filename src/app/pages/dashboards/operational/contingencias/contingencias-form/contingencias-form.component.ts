import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';

@Component({
    selector: 'app-contingencias-form',
    standalone: false,
    templateUrl: './contingencias-form.component.html',
    styleUrl: './contingencias-form.component.css'
})
export class ContingenciasFormComponent implements OnInit {
    frmContingencias: FormGroup;
    statusForm: boolean = true
    id!: number;
    botones = ['btn-guardar', 'btn-cancelar'];
    titulo = "";
    serviceName: String = '';
    titleData: String = '';

    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
        private modalActive: NgbActiveModal
    ) {
        this.frmContingencias = new FormGroup({
            Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            Norma: new FormControl(null, [Validators.required]),
            PorcentajeAforo: new FormControl(null, [Validators.required]),
            Activo: new FormControl(true, Validators.required),
        });
    }

    ngOnInit(): void {
        if (this.id != undefined && this.id != null) {
            this.titulo = `Editar ${this.titleData}`;
            this.service.getById(this.serviceName, this.id).subscribe(l => {
                this.frmContingencias.controls['Codigo'].setValue(l.data.codigo);
                this.frmContingencias.controls['Nombre'].setValue(l.data.nombre);
                this.frmContingencias.controls['Norma'].setValue(l.data.norma);
                this.frmContingencias.controls['PorcentajeAforo'].setValue(l.data.porcentajeAforo);
                this.frmContingencias.controls['Activo'].setValue(l.data.activo);
            })
        } else {
            this.titulo = `Crear ${this.titleData}`;
        }
    }

    save() {
        if (this.frmContingencias.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        let data = {
            id: this.id ?? 0,
            ...this.frmContingencias.value,
        };
        this.service.save(this.serviceName, this.id, data).subscribe(
            (response) => {
                if (response.status) {
                    this.modalActive.close(true);
                    this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
                }
            },
            (error) => {
                this.modalActive.close();
                this.helperService.showMessage(MessageType.ERROR, error);
            }
        )
    }

    cancel() {
        this.modalActive.close();
    }
}

@NgModule({
    declarations: [
        ContingenciasFormComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule
    ]
})
export class ContingenciasFormModule { }