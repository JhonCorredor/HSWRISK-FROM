import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonesComponent } from './botones/botones.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsMessagesComponent } from './forms-messages/forms-messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    BotonesComponent,
    BreadcrumbComponent,
    FormsMessagesComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BotonesComponent,
    BreadcrumbComponent,
    FormsMessagesComponent,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    UiSwitchModule,
    NgxSpinnerModule,
    NgSelectModule,
    HttpClientModule
  ]
})
export class GeneralModule { }
