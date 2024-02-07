import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styleUrls: ['./job-footer.component.scss']
})
export class JobFooterComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  currentSection = 'home';

  constructor() { }

  ngOnInit(): void {
  }

  /**
  * Section changed method
  * @param sectionId specify the current sectionID
  */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }
}
