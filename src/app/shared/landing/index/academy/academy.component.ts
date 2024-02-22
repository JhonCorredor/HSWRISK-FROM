import { Component, OnInit } from '@angular/core';

import {servicesModel} from './academy.module';
import { Services } from './data';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})

/**
 * Services Component
 */
export class AcademyComponent implements OnInit {

  Services!: servicesModel[];

  constructor() { }

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
      this.Services = Services;
    }

}
