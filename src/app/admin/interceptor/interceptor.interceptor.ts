
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HelperService, Messages, MessageType } from '../helper.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(private helperService: HelperService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token : string | null  = localStorage.getItem('token');

    let newRequest = request;
    
    newRequest = request.clone({
        setHeaders :  {
          'authorization': `Bearer ${token}`,
          'Content-Type' : "application/json",
          'Access-Control-Allow-Origin' : '*',
        }
      });
 
    return next.handle(newRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.helperService.showMessage(MessageType.WARNING, Messages.EXPIREDSESION);
          localStorage.clear();
          this.helperService.redirectApp("login");
        }
        return throwError( err );
      })
    );
  }
}
