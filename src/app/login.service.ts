import { Injectable } from '@angular/core';
import { Observable, EMPTY, throwError } from 'rxjs';

import { catchError ,map } from 'rxjs/operators';

import 'rxjs';
import { Http, URLSearchParams, Headers  } from '@angular/http';
import { HttpClient } from '@angular/common/http'
import { apiUrl } from './config'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http:HttpClient) { }
  authenticateUrl = apiUrl.authenticateUrl;

  login(loginObj):Observable<any>{
    
    return this._http.post(this.authenticateUrl,loginObj).pipe(      
      catchError(err => {      
      if (err.status == 401) {
        
        return EMPTY;
    } else {
        return throwError(err);
    }
      
    } ))
  }
}
