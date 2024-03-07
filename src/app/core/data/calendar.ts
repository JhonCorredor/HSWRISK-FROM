import { signal } from '@angular/core';
import { Evento } from '../../pages/dashboards/calendar/evento.module';
let eventGuid = 0;
export function createEventId() {
    return String(eventGuid++);
}

const category = [
    {
        name: 'Danger',
        value: 'bg-danger'
    },
    {
        name: 'Success',
        value: 'bg-success'
    },
    {
        name: 'Primary',
        value: 'bg-primary'
    },
    {
        name: 'Info',
        value: 'bg-info'
    },
    {
        name: 'Dark',
        value: 'bg-body'
    },
    {
        name: 'Warning',
        value: 'bg-warning'
    }
];

const calendarEvents = signal<Evento[]>([]);

export { category, calendarEvents };
