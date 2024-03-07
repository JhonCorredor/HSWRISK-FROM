import { Component, OnInit, signal } from '@angular/core';
import { HelperService } from '../admin/helper.service';
import { GeneralParameterService } from '../generic/general.service';
import { DatatableParameter } from '../admin/datatable.parameters';
import { Curso } from '../pages/dashboards/operational/cursos/cursos.module';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-academia',
    templateUrl: './academia.component.html',
    styleUrls: ['./academia.component.css']
})

/**
 * Academia Component
 */
export class AcademiaComponent implements OnInit {
    year: number = new Date().getFullYear();
    currentSection = 'academy';
    isCollapsed = true;
    listCursos = signal<Curso[]>([]);


    constructor(
        private service: GeneralParameterService,
        private helperService: HelperService,
        private sanitizer: DomSanitizer
    ) {
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

    sanitizeAndConvertUrl(url: string): SafeResourceUrl {
        let videoId: string;

        // Si la URL tiene el formato "https://youtu.be/SL_C1NVHflU?si=FqVaFJsAFhHTehF2"
        if (url.includes("youtu.be")) {
            const parts = url.split('/');
            videoId = parts[parts.length - 1].split('?')[0];
        } else {
            // Si la URL tiene el formato "https://www.youtube.com/embed/SL_C1NVHflU?si=5_I9WDi2TfapHqir"
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v')!;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    //PAGE
    /**
    * Section changed method
    * @param sectionId specify the current sectionID
    */
    onSectionChange(sectionId: string) {
        this.currentSection = sectionId;
    }

    /**
      * Window scroll method
      */
    // tslint:disable-next-line: typedef
    windowScroll() {
        const navbar = document.getElementById('navbar');
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            navbar?.classList.add('is-sticky');
        }
        else {
            navbar?.classList.remove('is-sticky');
        }

        // Top Btn Set
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            (document.getElementById("back-to-top") as HTMLElement).style.display = "block"
        } else {
            (document.getElementById("back-to-top") as HTMLElement).style.display = "none"
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}