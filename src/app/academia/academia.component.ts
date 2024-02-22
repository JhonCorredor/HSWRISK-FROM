import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from '../general/general.module';
import { NgbCarouselModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { HelperService, Messages, MessageType } from '../admin/helper.service';
import { CursosModel } from './cursos.module';
import { Cursos } from './data';

@Component({
    selector: 'app-academia',
    templateUrl: './academia.component.html',
    styleUrls: ['./academia.component.css']
})

/**
 * Academia Component
 */
export class AcademiaComponent implements OnInit {
    currentSection = 'academy';
    isCollapsed = true;
    Cursos!: CursosModel[];


    constructor(
        private helperService: HelperService,
    ) {
    }

    ngOnInit(): void {
        /**
        * fetches data
        */
        this._fetchData();
    }

    /**
    * User grid data fetches
    */
    private _fetchData() {
        this.Cursos = Cursos;
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
@NgModule({
    declarations: [
        AcademiaComponent,
    ],
    imports: [
        CommonModule,
        GeneralModule,
        NgbCarouselModule,
        NgbTooltipModule,
        NgbCollapseModule,
        ScrollToModule.forRoot(),
    ]
})
export class AcademiaModule { }