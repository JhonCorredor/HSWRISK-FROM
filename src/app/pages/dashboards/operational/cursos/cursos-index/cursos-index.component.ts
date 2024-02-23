import { Component, OnInit, NgModule, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DatatableParameter } from '../../../../../admin/datatable.parameters';
import { Curso } from '../cursos.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';

@Component({
    selector: 'app-cursos-index',
    standalone: false,
    templateUrl: './cursos-index.component.html',
    styleUrl: './cursos-index.component.css'
})
export class CursosIndexComponent implements OnInit {
    API_URL: any;
    title = "Listado de Cursos";
    breadcrumb!: any[];
    botones: String[] = ['btn-nuevo'];
    listCursos = signal<Curso[]>([]);

    constructor(
        private service: GeneralParameterService,
        private modalService: NgbModal,
        private helperService: HelperService
    ) {
        this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Operativo", icon: "fa-duotone fa-shop" }, { name: "Curso", icon: "fa-duotone fa-person-chalkboard" }];
    }

    ngOnInit(): void {
        this.cargarLista();
    }

    cargarLista() {
        this.getData().then((datos) => {
            datos.data.forEach((item: any) => {
                this.listCursos.update(listCursos => {
                    const Curso: Curso = {
                        id: item.id,
                        activo: item.activo,
                        codigo: item.codigo,
                        nombre: item.nombre,
                        norma: item.norma,
                        descripcion: item.descripcion,
                        url: item.url,
                    };

                    return [...listCursos, Curso];
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
        var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = "";
        return new Promise((resolve, reject) => {
            this.service.datatable("Curso", data).subscribe(
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
        this.listCursos = signal<Curso[]>([]);
        this.cargarLista();
    }

    nuevo() {
        this.helperService.redirectApp("dashboard/operativo/cursos/crear");
    }

    update(id: any) {
        this.helperService.redirectApp(`dashboard/operativo/cursos/editar/${id}`);
    }

    deleteGeneric(id: any) {
        this.helperService.confirmDelete(() => {
            this.service.delete("Curso", id).subscribe(
                (response) => {
                    if (response.status) {
                        this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
                        this.refrescarTabla();
                    }
                },
                (error) => {
                    this.helperService.showMessage(MessageType.ERROR, error);
                }
            )
        });
    }
}


@NgModule({
    declarations: [
        CursosIndexComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule,
    ]
})
export class CursosIndexModule { }