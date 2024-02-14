import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-botones',
  templateUrl: './botones.component.html',
  styleUrls: ['./botones.component.css']
})
export class BotonesComponent implements OnInit {

  @ViewChild('botonesDropdown') botonesDropdown!: ElementRef;
  @ViewChild('botonesNormal') botonesNormal!: ElementRef;

  @Input() dropdown: Boolean = false;
  @Input() botones: String[] = [];
  @Output() eventSave = new EventEmitter<any>();
  @Output() eventEdit = new EventEmitter<any>();
  @Output() eventSee = new EventEmitter<any>();
  @Output() eventDelete = new EventEmitter<any>();
  @Output() eventCancel = new EventEmitter<any>();
  @Output() eventNew = new EventEmitter<any>();
  @Output() eventTraslate = new EventEmitter<any>();
  @Output() eventAgg = new EventEmitter<any>();
  @Output() eventArchive = new EventEmitter<any>();
  @Output() eventClean = new EventEmitter<any>();
  @Output() eventSearch = new EventEmitter<any>();
  @Output() eventObservaciones = new EventEmitter<any>();
  @Output() eventPrint = new EventEmitter<any>();
  @Output() eventDowloand = new EventEmitter<any>();
  @Output() eventChangePassword = new EventEmitter<any>();
  @Output() eventPrecotizacion = new EventEmitter<any>();
  @Output() eventGenerarCotizacion = new EventEmitter<any>();
  @Output() eventExcelEmpleado = new EventEmitter<any>();
  @Output() eventImportarEmpleado = new EventEmitter<any>();
  @Output() eventCargeMasivo = new EventEmitter<any>();
  @Output() eventFichaTecnica = new EventEmitter<any>();
  @Output() eventVerImagen = new EventEmitter<any>();
  @Output() eventCopy = new EventEmitter<any>();
  @Output() eventGenerarOrdenProduccion = new EventEmitter<any>();
  @Output() eventImportarCliente = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  validateIfExists(boton: any): Boolean {
    if (this.botones.find(i => i == boton)) {
      return true
    }

    return false;
  }

}
