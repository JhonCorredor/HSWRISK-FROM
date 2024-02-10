import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-forms-messages',
  templateUrl: './forms-messages.component.html',
  styleUrls: ['./forms-messages.component.css']
})
export class FormsMessagesComponent implements OnInit {

  @Input() error: any ;
  @Input() statusForm : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  // showMessage() : boolean {
  //   if(this.error?.errors != null && this.error?.touched && this.select){
  //       return true
  //   }
  //       return false
  // }

}
