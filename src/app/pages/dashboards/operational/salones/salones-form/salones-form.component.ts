import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';


@Component({
    selector: 'app-salones-form',
    standalone: false,
    templateUrl: './salones-form.component.html',
    styleUrl: './salones-form.component.css'
})
export class SalonesFormComponent implements OnInit {
    frmSalones: FormGroup;
    statusForm: boolean = true
    id!: number;
    botones = ['btn-guardar', 'btn-cancelar'];
    titulo = "";
    serviceName: String = '';
    titleData: String = '';
    listCiudades = signal<DataSelectDto[]>([]);
    listaContingencia = signal<DataSelectDto[]>([]);
    listEstados = signal<DataSelectDto[]>([]);

    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
        private modalActive: NgbActiveModal
    ) {
        this.frmSalones = new FormGroup({
            Codigo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            Nombre: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            Aforo: new FormControl(null, [Validators.required]),
            ContingenciaId: new FormControl(null, [Validators.required]),
            EstadoId: new FormControl(null, [Validators.required]),
            CiudadId: new FormControl(null, [Validators.required]),
            Activo: new FormControl(true, Validators.required),
        });
    }

    ngOnInit(): void {
        this.cargarListas();

        if (this.id != undefined && this.id != null) {
            this.titulo = `Editar ${this.titleData}`;
            this.service.getById(this.serviceName, this.id).subscribe(l => {
                this.frmSalones.controls['Codigo'].setValue(l.data.codigo);
                this.frmSalones.controls['Nombre'].setValue(l.data.nombre);
                this.frmSalones.controls['Aforo'].setValue(l.data.aforo);
                this.frmSalones.controls['ContingenciaId'].setValue(l.data.contingenciaId);
                this.frmSalones.controls['EstadoId'].setValue(l.data.estadoId);
                this.frmSalones.controls['CiudadId'].setValue(l.data.ciudadId);
                this.frmSalones.controls['Activo'].setValue(l.data.activo);
            })
        } else {
            this.titulo = `Crear ${this.titleData}`;
        }
    }

    cargarListas() {
        this.cargarCiudades();
        this.cargarContingencias();
        this.cargarEstados();
    }

    cargarCiudades() {
        this.service.getAll('Ciudad').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listCiudades.update((listCiudades) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listCiudades, DataSelectDto];
                });
            });
        });
    }

    cargarContingencias() {
        this.service.getAll('Contingencia').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listaContingencia.update((listaContingencia) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listaContingencia, DataSelectDto];
                });
            });
        });
    }

    cargarEstados() {
        this.service.getAll('Estado').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listEstados.update((listEstados) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listEstados, DataSelectDto];
                });
            });
        });
    }

    save() {
        if (this.frmSalones.invalid) {
            this.statusForm = false
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        let data = {
            id: this.id ?? 0,
            ...this.frmSalones.value,
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
        SalonesFormComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule
    ]
})
export class SalonesFormModule { }