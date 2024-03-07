export interface Evento {
    id: any;
    title: string;
    description?: string;
    url?: string;
    start: Date;
    date: Date;
    end: Date;
    className: string;
    location?: string;
    allDay: boolean;
    personaId?: number;
    categoriaEventoId?: number;
    persona?: string;
    categoriaEvento?: string;
}