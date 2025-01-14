import { Component, NgModule, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import { ActivatedRoute } from '@angular/router';
import { GeneralParameterService } from 'src/app/generic/general.service';
import { HelperService, MessageType } from 'src/app/admin/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableParameter } from 'src/app/admin/datatable.parameters';
import { GeneralModule } from 'src/app/general/general.module';

@Component({
  selector: 'app-report-exel',
  standalone: false,
  templateUrl: './report-exel.component.html',
  styleUrl: './report-exel.component.scss'
})
export class ReportExelComponent {
 reportForm: FormGroup;
    statusForm: boolean = true
    botones = ['btn-cancelar'];
    file?: File;
    listEnterprises = signal<DataSelectDto[]>([]);
    listCourseDetail = signal<DataSelectDto[]>([]);
    listCourse = signal<DataSelectDto[]>([]);
    curso = false;
    
    constructor(
        public routerActive: ActivatedRoute,
        private service: GeneralParameterService,
        private helperService: HelperService,
        private modalActive: NgbActiveModal,
         private datePipe: DatePipe
        
    ) {
        this.reportForm = new FormGroup({
            CourseId: new FormControl(0),
            EnterpriseId: new FormControl(0),
            CourseDetailId: new FormControl(0),
            StartDate: new FormControl(null),
            EndDate: new FormControl(null),
        });
    }

    ngOnInit(): void {
        this.cargarEmpresas();
        this.cargarCursos();
    
    }

    

    cargarEmpresas() {
        this.service.getAll('Empresa').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listEnterprises.update(listEnterprises => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.nit} - ${item.razonSocial}`,
                        activo: item.activo
                    };

                    return [...listEnterprises, DataSelectDto];
                });
            });
        });
    }

    cancel() {
        this.modalActive.close();
    }

    cargarCursos() {
        this.service.getAll('Curso').subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listCourse.update((listCourse) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.codigo} - ${item.nombre}`,
                        activo: item.activo,
                    };

                    return [...listCourse, DataSelectDto];
                });
            });
        });
    }

    cargarCursoDetalle(cursoId: number) {
        var data = new DatatableParameter(); data.pageNumber = ''; data.pageSize = ''; data.filter = ''; data.columnOrder = ''; data.directionOrder = ''; data.foreignKey = cursoId; data.nameForeignKey = "CursoId";

        this.service.datatableKey('CursoDetalle', data).subscribe((res) => {
            res.data.forEach((item: any) => {
                this.listCourseDetail.update((listCourseDetail) => {
                    const DataSelectDto: DataSelectDto = {
                        id: item.id,
                        textoMostrar: `${item.curso} - ${item.salon} - ${item.nivel} - ${item.jornada} - Fecha Inicio: ${this.helperService.convertDateUTCToDMA(item.fechaInicio)} `,
                        activo: item.activo,
                    };

                    return [...listCourseDetail, DataSelectDto];
                });
            });
        });
    }

    onChangeCurso(event: any) {
        if (typeof event != "undefined") {
            this.curso = true;
            this.cargarCursoDetalle(event.id);
        } else {
            this.curso = false;
            this.listCourseDetail = signal<DataSelectDto[]>([]);
        }
    }

    //dowload report 
    reportDowload(){
      this.helperService.showLoading();
      var data = {

        ...this.reportForm.value,
        EndDate: this.formatDate(this.reportForm.controls["EndDate"].value),
        StartDate: this.formatDate(this.reportForm.controls["StartDate"].value)

      }
      this.service.generarReport(data).subscribe(
          (certificado: any) => {
              if (certificado && certificado.data ) {
                  const base64String = certificado.data;
                  const binaryString = window.atob(base64String);
                  const binaryLen = binaryString.length;
                  const bytes = new Uint8Array(binaryLen);
  
                  for (let i = 0; i < binaryLen; i++) {
                      bytes[i] = binaryString.charCodeAt(i);
                  }
  
                  const blob = new Blob([bytes], { type: `application/exel` });
                  const url = window.URL.createObjectURL(blob);
  
                  // Crear un enlace dinámico para descargar el archivo
                  const a = document.createElement('a');
                  a.style.display = 'none';
                  a.href = url;
                  a.download = `Report.${certificado.data.extension || 'xlsx'}`; // Nombre dinámico
  
                  document.body.appendChild(a);
                  a.click();
  
                  // Limpiar recursos
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
              
  
                  this.helperService.hideLoading();
              } else {
                  this.helperService.hideLoading();
                  throw new Error('Datos del certificado no válidos.');
              }
          },
          (error) => {
              // Manejar errores de la API o datos faltantes
              const errorMessage = error?.message || "Error desconocido al generar el reporte.";
              this.helperService.showMessage(MessageType.ERROR, errorMessage);
              this.helperService.hideLoading();
          }
      );
    }
    
    formatDate(inputDate: string): string {
        // Convert input string to Date object
        let dateObject = new Date(inputDate);

        // Format the date using DatePipe
        return this.datePipe.transform(dateObject, 'yyyy-MM-dd HH:mm:ss') || "Invalid Date";
    }
}

@NgModule({
    declarations: [
        ReportExelComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule
    ]
})
export class ReportExelFormModule { }

