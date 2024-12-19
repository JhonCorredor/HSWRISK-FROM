import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatatableParameter } from '../admin/datatable.parameters';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GeneralParameterService {

  private url = environment.url;
  private header = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.header.set("Content-Type", "application/json");
  }

  public dataTableLastCourseDetails(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/dataTableLastCourseDetails?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}`, { headers: this.header })
  }

  public dataTableInstructor(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/dataTableInstructor?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}&FechaInicio=${data.fechaInicio}&FechaFin=${data.fechaFin}`, { headers: this.header });
  }

  public getCertificado(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/getDataTableCompleto?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ColumnFilter=${data.columnFilter}`, { headers: this.header })
  }

  public datatable(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatable?PageNumber=${data.pageNumber}&PageSize=${data.pageSize}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}`, { headers: this.header })
  }

  public datatableKey(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/datatable?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}&FechaInicio=${data.fechaInicio}&FechaFin=${data.fechaFin}`, { headers: this.header });
  }

  public dataTableAbierto(ruta: String, data: DatatableParameter): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/dataTableAbierto?PageSize=${data.pageSize}&PageNumber=${data.pageNumber}&Filter=${data.filter}&ColumnOrder=${data.columnOrder}&DirectionOrder=${data.directionOrder}&ForeignKey=${data.foreignKey}&NameForeignKey=${data.nameForeignKey}&FechaInicio=${data.fechaInicio}&FechaFin=${data.fechaFin}`, { headers: this.header });
  }

  public getById(ruta: String, id: any): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/${id}`, { headers: this.header });
  }

  public getByCode(ruta: String, code: any): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/code/${code}`, { headers: this.header });
  }

  public getAll(ruta: String): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/select`, { headers: this.header });
  }

  public save(ruta: String, id: any, data: any): Observable<any> {
    if (id) {
      return this.http.put<any>(`${this.url}${ruta}`, data, { headers: this.header });
    }
    return this.http.post<any>(`${this.url}${ruta}`, data, { headers: this.header });
  }

  public delete(ruta: String, id: any): Observable<any> {
    return this.http.delete<any>(`${this.url}${ruta}/${id}`, { headers: this.header });
  }

  public saveDetalles(ruta: String, data: any): Observable<any> {
    return this.http.post<any>(`${this.url}${ruta}/saveDetalles`, data, { headers: this.header });
  }

  public getByTablaId(ruta: String, id: any, nombre: String): Observable<any> {
    return this.http.get<any>(`${this.url}${ruta}/getByTablaId/${id}/${nombre}`, { headers: this.header });
  }
   //Controller Enum
   public getEnum(parametro: String): Observable<any> {
    return this.http.get<any>(`${this.url}Enums?endpoint=${parametro}`, { headers: this.header });
  }

  public generarCertificado(ruta: String, id: any): Observable<any> {
    return this.http.post<any>(`${this.url}${ruta}/generarCertificado/${id}`, { headers: this.header });
  }
  


}