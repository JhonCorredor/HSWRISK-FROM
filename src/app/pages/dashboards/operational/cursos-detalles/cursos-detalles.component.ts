import { Component, Input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../generic/general.service';
import { DataSelectDto } from '../../../../generic/dataSelectDto';
import { CursoDetalle } from './cursos-detalles.module';
import { DatatableParameter } from '../../../../admin/datatable.parameters';

@Component({
    selector: 'app-cursos-detalles',
    standalone: false,
    templateUrl: './cursos-detalles.component.html',
    styleUrl: './cursos-detalles.component.css'
})
export class CursosDetallesComponent implements OnInit {
    botones = ['btn-guardar'];
    @Input() CursoId: any = null;
    frmCursoDetalles: FormGroup;
    statusForm: boolean = true;
    @Input() DetailsViewId : any = null;
    listEmpleados = signal<DataSelectDto[]>([]);
    listSalones = signal<DataSelectDto[]>([]);
    listNiveles = signal<DataSelectDto[]>([]);
    listDisponibilidad = signal<DataSelectDto[]>([]);

    listJornadas = signal<DataSelectDto[]>([]);
    listEstados = signal<DataSelectDto[]>([]);
    listCursoDetalles = signal<CursoDetalle[]>([]);

    constructor(
        public helperService: HelperService,
        private service: GeneralParameterService,
        private datePipe: DatePipe
    ) {
        this.frmCursoDetalles = new FormGroup({
            Id: new FormControl(0, Validators.required),
            CursoId: new FormControl(this.CursoId, Validators.required),
            Precio: new FormControl(null, Validators.required),
            Duracion: new FormControl(null, Validators.required),
            FechaInicio: new FormControl(null, Validators.required),
            FechaFin: new FormControl(null, Validators.required),
            Virtual: new FormControl(false, Validators.required),
            EmpleadoId: new FormControl(null, Validators.required),
            EstadoId: new FormControl(null, Validators.required),
            SalonId: new FormControl(null, Validators.required),
            NivelId: new FormControl(null, Validators.required),
            JornadaId: new FormControl(null, Validators.required),
            Activo: new FormControl(true, Validators.required),
        });
    }

    ngOnInit(): void {
   
        if(this.DetailsViewId >0){
            const index = this.botones.indexOf('btn-guardar');
            if (index !== -1) {
                this.botones.splice(index, 1);
            }
        }

        this.cargarLista();
        this.cargarSelect();
    }

    cargarSelect() {
        this.cargarEmpleados();
        this.cargarSalones();
        this.cargarNiveles();
        

        this.cargarJornadas();
        this.cargarEstados();
    }

    cargarEmpleados() {
        var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = "";

        this.service.datatable('Empleado', data).subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listEmpleados.update(listEmpleados => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.persona}`,
                        activo: item.activo
                    };

                    return [...listEmpleados, DataSelectDto];
                });
            });
        });
    }

    cargarSalones() {
        this.service.getAll('Salon').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listSalones.update(listSalones => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo
                    };

                    return [...listSalones, DataSelectDto];
                });
            });
        });
    }

    cargarNiveles() {
        this.service.getAll('Nivel').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listNiveles.update(listNiveles => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo
                    };

                    return [...listNiveles, DataSelectDto];
                });
            });
        });
    }

    cargarJornadas() {
        this.service.getAll('Jornada').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listJornadas.update(listJornadas => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo
                    };

                    return [...listJornadas, DataSelectDto];
                });
            });
        });
    }

    cargarEstados() {
        this.service.getAll('Estado').subscribe((res) => {
            res.data.forEach((item: any) => {
                
                if (item.codigo == "ABIERTO" || item.codigo == "CERRADO") {
                    this.listEstados.update(listEstados => {
                        const DataSelectDto: DataSelectDto = {
                            id: item.id,
                            textoMostrar: `${item.codigo} - ${item.nombre}`,
                            activo: item.activo
                        };

                        return [...listEstados, DataSelectDto];
                    });
                    this.frmCursoDetalles.controls["EstadoId"].setValue(item.id);
                }
            });
        });
    }

    cargarLista() {
        this.getData().then((datos) => {
            datos.data.forEach((item: any) => {
                this.listCursoDetalles.update(listCursoDetalles => {
                    const CursoDetalle: CursoDetalle = {
                        id: item.id,
                        activo: item.activo,
                        precio: item.precio,
                        duracion: item.duracion,
                        fechaInicio: item.fechaInicio,
                        fechaFin: item.fechaFin,
                        virtual: item.virtual,
                        cursoId: item.cursoId,
                        empleadoId: item.empleadoId,
                        estadoId: item.estadoId,
                        salonId: item.salonId,
                        nivelId: item.nivelId,
                        jornadaId: item.jornadaId,
                        curso: item.curso,
                        empleado: item.empleado,
                        estado: item.estado,
                        salon: item.salon,
                        nivel: item.nivel,
                        jornada: item.jornada
                    };

                    return [...listCursoDetalles, CursoDetalle];
                });
            });

            setTimeout(() => {
                $("#datatable").DataTable({
                    dom: 'Blfrtip',
                    destroy: true,
                    language: LANGUAGE_DATATABLE,
                    processing: true
                });
            }, 200);
        })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }

    getData(): Promise<any> {
        var data = new DatatableParameter(); 
        data.foreignKey = this.CursoId; 
        data.nameForeignKey = "CursoId";
       
        data.pageNumber = ""; data.pageSize = ""; 
        data.filter = ""; data.columnOrder = ""; 
        data.directionOrder = ""; 
        
        if(this.DetailsViewId >0){
            
            data.extra = this.DetailsViewId;
            data.foreignKey = "";
            data.nameForeignKey = "";
        }
        return new Promise((resolve, reject) => {
            this.service.datatableKey("CursoDetalle", data).subscribe(
                (datos) => {
                    resolve(datos);
                },
                (error) => {
                    reject(error);
                }
            )
        });
    }

    refrescarTabla() {
        $("#datatable").DataTable().destroy();
        this.listCursoDetalles = signal<CursoDetalle[]>([]);
        this.cargarLista();
    }

    save() {
        this.frmCursoDetalles.controls['CursoId'].setValue(this.CursoId);
        if (this.frmCursoDetalles.invalid) {
            this.statusForm = false;
            this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
            return;
        }
        this.helperService.showLoading();
        let data = this.frmCursoDetalles.value;
        this.service.save("CursoDetalle", this.frmCursoDetalles.controls['Id'].value, data).subscribe(
            (response) => {
                if (response.status) {
                    setTimeout(() => {
                        this.helperService.hideLoading();
                    }, 200);
                    this.refrescarTabla();
                    this.frmCursoDetalles.reset();
                    this.frmCursoDetalles.controls['Id'].setValue(0);
                    this.helperService.showMessage(
                        MessageType.SUCCESS,
                        Messages.SAVESUCCESS
                    );
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
                this.helperService.showMessage(
                    MessageType.WARNING,
                    error
                );
            }
        );
    }

    update(item: any) {
        this.frmCursoDetalles.controls['Id'].setValue(item.id);
        this.frmCursoDetalles.controls['CursoId'].setValue(item.cursoId);
        this.frmCursoDetalles.controls['Precio'].setValue(item.precio);
        this.frmCursoDetalles.controls['Duracion'].setValue(item.duracion);
        this.frmCursoDetalles.controls['Virtual'].setValue(item.virtual);
        this.frmCursoDetalles.controls['EmpleadoId'].setValue(item.empleadoId);
        this.frmCursoDetalles.controls['EstadoId'].setValue(item.estadoId);
        this.frmCursoDetalles.controls['SalonId'].setValue(item.salonId);
        this.frmCursoDetalles.controls['NivelId'].setValue(item.nivelId);
        this.frmCursoDetalles.controls['JornadaId'].setValue(item.jornadaId);
        this.frmCursoDetalles.controls['Activo'].setValue(item.activo);

        const formattedFechaInicio = this.datePipe.transform(
            item.fechaInicio,
            'yyyy-MM-dd',
            'America/Bogota'
        );
        const formattedFechaFin = this.datePipe.transform(
            item.fechaFin,
            'yyyy-MM-dd',
            'America/Bogota'
        );

        this.frmCursoDetalles.controls['FechaInicio'].setValue(formattedFechaInicio);
        this.frmCursoDetalles.controls['FechaFin'].setValue(formattedFechaFin);
    }

    deleteGeneric(id: any) {
        this.helperService.confirmDelete(() => {
            this.service.delete("CursoDetalle", id).subscribe(
                (response) => {
                    if (response.status) {
                        this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
                        this.refrescarTabla();
                    }
                },
                (error) => {
                    this.helperService.showMessage(MessageType.WARNING, error);
                }
            )
        });
    }
}