import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, NgModule, signal, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Evento } from './evento.module';
import { GeneralParameterService } from '../../../generic/general.service';
import { HelperService, MessageType, Messages } from 'src/app/admin/helper.service';
import Swal from 'sweetalert2';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

/**
 * Calendar Component
 */
export class CalendarComponent implements OnInit {
  // bread crumb items
  id?: any;
  title = "Calendario";
  breadcrumb: any[] = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Calendario", icon: "fa-duotone fa-calendar-days" }];
  // calendar
  calendarEvents = signal<Evento[]>([]);
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  submitted = false;
  isEditMode: boolean = false;
  isDeleteEvent: boolean = false;
  // Calendar click Event
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;
  currentEvents: EventApi[] = [];
  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek',
      center: 'title',
      left: 'prev,next today',
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    events: this.calendarEvents(),
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    select: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };

  listCategorias = signal<any[]>([]);

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private changeDetector: ChangeDetectorRef,
    public datePipe: DatePipe,
    private service: GeneralParameterService,
    public helperService: HelperService,
  ) {
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      start: ['', Validators.required],
      end: ['', Validators.required],
      date: [''],
    });
  }

  ngOnInit(): void {
    this.CargarEventos();
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.service.getAll('CategoriaEvento').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listCategorias.update((listCategorias) => {
          const DataSelectDto = {
            id: item.id,
            name: item.nombre,
            value: item.codigo,
            className: item.className,
            activo: item.activo,
          };

          return [...listCategorias, DataSelectDto];
        });
      });
    });
  }

  CargarEventos() {
    this.service.getAll("Evento").subscribe((res: any) => {
      res.data.forEach((item: any) => {
        this.calendarEvents.update(calendarEvents => {
          const Evento: Evento = {
            id: item.id,
            title: item.titulo,
            description: item.descripcion,
            url: item.url,
            start: item.fechaInicio,
            end: item.fechaFin,
            date: item.fechaInicio,
            className: item.className,
            location: item.ubicacion,
            allDay: item.allDay,
            personaId: item.personaId,
            categoriaEventoId: item.categoriaEventoId,
            persona: item.persona,
            categoriaEvento: item.categoriaEvento,
          };

          return [...calendarEvents, Evento];
        });
      });

      this.calendarOptions.events = this.calendarEvents().map(
        (evt: any) => {
          return { id: evt.id, start: evt.start, end: evt.end, date: evt.start, title: evt.title, className: evt.className, location: evt.location, description: evt.description }
        });
    });
  }

  refrescarTabla() {
    this.calendarEvents = signal<Evento[]>([]);
    this.CargarEventos();
  }

  openModal(event?: any) {
    this.isDeleteEvent = false;
    this.formData.reset();
    this.submitted = false;
    this.newEventDate = event,
      this.formBuilder.group({
        editDate: this.newEventDate.date
      })
    this.modalService.open(this.modalShow, { centered: true });
  }

  /**
   * Event click modal show
   */
  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    this.isDeleteEvent = true;
    this.isEditMode = true;
    this.editEvent = clickInfo.event;
    this.id = Number(this.editEvent.id);

    setTimeout(() => {
      document.getElementById('form-event')?.classList.add('view-event');
      var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement;
      modaltitle.innerHTML = this.editEvent.title;
      (document.getElementById('btn-save-event') as HTMLElement).setAttribute("hidden", "true");
    }, 100);

    this.formData = this.formBuilder.group({
      title: this.editEvent.title,
      category: this.editEvent.classNames[0],
      location: this.editEvent.extendedProps['location'],
      description: this.editEvent.extendedProps['description'],
      start: this.editEvent.startStr,
      date: this.editEvent.startStr,
      end: this.editEvent.endStr
    });

    this.modalService.open(this.modalShow, { centered: true });
  }

  // edit model
  showeditEvent() {
    if (document.querySelector('#edit-event-btn')?.innerHTML == 'Cancelar') {
      document.getElementById('form-event')?.classList.add('view-event');
      var editbtn = document.querySelector('#edit-event-btn') as HTMLAreaElement;
      editbtn.innerHTML = 'Edit';
      (document.getElementById('btn-save-event') as HTMLElement).setAttribute("hidden", "true");
    } else {
      document.getElementById('form-event')?.classList.remove('view-event');
      (document.getElementById('btn-save-event') as HTMLElement).removeAttribute("hidden");

      var modalbtn = document.querySelector('#btn-save-event') as HTMLAreaElement;
      modalbtn.innerHTML = "Editar Evento"
      var editbtn = document.querySelector('#edit-event-btn') as HTMLAreaElement;
      editbtn.innerHTML = 'Cancelar'
    }
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      category: '',
      location: '',
      description: '',
      start: '',
      date: '',
      end: ''
    });
    this.modalService.dismissAll();
  }

  /***
   * Model Position Set
   */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'El evento ha sido guardado.',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /***
   * Model Edit Position Set
   */
  Editposition() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'El evento ha sido actualizado',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Event Data Get
   */
  get form() {
    return this.formData.controls;
  }


  /**
  * Save the event
  */

  saveEvent() {
    if (document.querySelector('#btn-save-event')?.innerHTML == 'Crear Evento') {
      if (this.formData.valid) {
        this.helperService.showLoading();
        var category = this.listCategorias().find(categoria => categoria.className == this.formData.get('category')!.value);

        let data = {
          Id: 0,
          Activo: true,
          Titulo: this.formData.get('title')!.value,
          Descripcion: this.formData.get('description')!.value,
          Url: "",
          FechaInicio: this.formData.get('start')!.value,
          FechaFin: this.formData.get('end')!.value,
          ClassName: this.formData.get('category')!.value,
          Ubicacion: this.formData.get('location')!.value,
          AllDay: false,
          PersonaId: localStorage.getItem('persona_Id'),
          CategoriaEventoId: category.id,
        };

        this.service.save("Evento", data.Id, data).subscribe(
          (response) => {
            if (response.status) {
              this.helperService.hideLoading();
              this.refrescarTabla();
              this.position();
              this.modalService.dismissAll();
              this.submitted = true;
            } else {
              this.helperService.hideLoading();
            }
          },
          (error) => {
            this.helperService.hideLoading();
            this.helperService.showMessage(MessageType.WARNING, error);
          }
        );

      } else {
        this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      }
    } else {
      this.editEventSave()
    }

  }

  /**
   * save edit event data
   */
  editEventSave() {
    if (document.querySelector('#btn-save-event')?.innerHTML == 'Editar Evento') {
      if (this.formData.valid) {
        this.helperService.showLoading();
        var category = this.listCategorias().find(categoria => categoria.className == this.formData.get('category')!.value);

        let data = {
          Id: this.editEvent.id,
          Activo: true,
          Titulo: this.formData.get('title')!.value,
          Descripcion: this.formData.get('description')!.value,
          Url: "",
          FechaInicio: this.formData.get('start')!.value,
          FechaFin: this.formData.get('end')!.value,
          ClassName: this.formData.get('category')!.value,
          Ubicacion: this.formData.get('location')!.value,
          AllDay: false,
          PersonaId: localStorage.getItem('persona_Id'),
          CategoriaEventoId: category.id,
        };

        this.service.save("Evento", data.Id, data).subscribe(
          (response) => {
            if (response.status) {
              this.helperService.hideLoading();
              this.refrescarTabla();
              this.Editposition();
              this.modalService.dismissAll();
            } else {
              this.helperService.hideLoading();
            }
          },
          (error) => {
            this.helperService.hideLoading();
            this.helperService.showMessage(MessageType.WARNING, error);
          }
        );
      } else {
        this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      }
    }
  }

  /**
   * Delete-confirm
   */
  confirm() {
    if (this.formData.valid) {
      Swal.fire({
        title: 'Estas seguro?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Si, borralo!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.deleteEventData();
        }
      });
    }
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.service.delete("Evento", this.id).subscribe(
      (response) => {
        if (response.status) {
          Swal.fire('Eliminado!', 'El evento ha sido eliminado..', 'success');
          this.refrescarTabla();
          this.modalService.dismissAll();
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.WARNING, error);
      }
    );
  }
}
@NgModule({
  declarations: [
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
    FullCalendarModule,
    FlatpickrModule.forRoot(),
  ]
})
export class CalendarModule { }