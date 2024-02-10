import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = environment.url;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
  }

  Authenticate(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}Usuario/Authenticate`, data, { headers: this.headers })
  }

  UpdatePassword(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}Usuario/UpdatePassword/${id}`, data, { headers: this.headers });
  }
}
