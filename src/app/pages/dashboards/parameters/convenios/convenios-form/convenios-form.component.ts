import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';

@Component({
    selector: 'app-convenios-form',
    standalone: false,
    templateUrl: './convenios-form.component.html',
    styleUrl: './convenios-form.component.css'
})
export class ConveniosFormComponent implements OnInit {
    frmConvenios: FormGroup;
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
        private modalActive: NgbActiveModal,
        private datePipe: DatePipe
    ) {
        this.frmConvenios = new FormGroup({
            Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            Valor: new FormControl(null, [Validators.required]),
            FechaInicio: new FormControl(null, [Validators.required]),
            FechaFin: new FormControl(null, [Validators.required]),
            Activo: new FormControl(true, Validators.required)
        });
    }

    ngOnInit(): void {
        if (this.id != undefined && this.id != null) {
            this.titulo = `Editar ${this.titleData}`;
            this.service.getById(this.serviceName, this.id).subscribe(l => {
                this.frmConvenios.controls['Codigo'].setValue(l.data.codigo);
                this.frmConvenios.controls['Nombre'].setValue(l.data.nombre);
                this.frmConvenios.controls['Valor'].setValue(l.data.valor);
                this.frmConvenios.controls['Activo'].setValue(l.data.activo);

                const formattedFechaInicio = this.datePipe.transform(
                    l.data.fechaInicio,
                    'yyyy-MM-dd',
                    'America/Bogota'
                );
                const formattedFechaFin = this.datePipe.transform(
                    l.data.fechaFin,
                    'yyyy-MM-dd',
                    'America/Bogota'
                );

                this.frmConvenios.controls['FechaInicio'].setValue(formattedFechaInicio);
                this.frmConvenios.controls['FechaFin'].setValue(formattedFechaFin);
            })
        } else {
            this.titulo = `Crear ${this.titleData}`;
        }
    }

    save() {
        if (this.frmConvenios.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        this.helperService.showLoading();
        let data = {
            id: this.id ?? 0,
            ...this.frmConvenios.value
        };
        this.service.save(this.serviceName, this.id, data).subscribe(
            (response) => {
                if (response.status) {
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                    this.modalActive.close(true);
                    this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
                } else {
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                }
            },
            (error) => {
                setTimeout(() => {
                    this.helperService.hideLoading();
                }, 200);
                this.helperService.showMessage(MessageType.WARNING, error);
            }
        )
    }

    cancel() {
        this.modalActive.close();
    }
}

@NgModule({
    declarations: [
        ConveniosFormComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule
    ]
})
export class ConveniosFormModule { }