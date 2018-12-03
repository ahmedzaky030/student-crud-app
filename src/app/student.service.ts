import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { apiUrl } from './config'
import { map, catchError } from 'rxjs/operators';
import { Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private _http:Http, private router: Router) { }
  gradeUrl = apiUrl.gradeUrl;
  studentUrl = apiUrl.studentUrl;
  classesUrl = apiUrl.classUrl;

  getGradeList(): Observable<any>{
    
    let headers = new Headers();
    let token = localStorage.getItem('auth');
    headers.set('Authorization', 'Bearer '+ token)

    return this._http.get(this.gradeUrl , {headers:headers}).pipe(
      catchError( e => this.handleError(e))
    )
  }

  getStudentList(): Observable<any>{
    
    let headers = new Headers();
    let token = localStorage.getItem('auth');
    headers.set('Authorization', 'Bearer '+ token)
    return this._http.get(this.studentUrl , {headers:headers}).pipe(
      catchError( e => this.handleError(e))
    )
  }

  getClassesListByGradeId(id){
    let headers = new Headers();
    let token = localStorage.getItem('auth');
    headers.set('Authorization', 'Bearer '+ token)

    return this._http.get(this.classesUrl + '/'+ id , {headers:headers}).pipe(
      catchError( e => this.handleError(e))
    )

  }

  deleteStudent(id){
    let headers = new Headers();
    let token = localStorage.getItem('auth');
    headers.set('Authorization', 'Bearer '+ token)

    return this._http.delete(this.studentUrl + '/'+ id , {headers:headers}).pipe(
      catchError( e => this.handleError(e))
    )
  }

  createStudent(obj){
    let headers = new Headers();
    let token = localStorage.getItem('auth');
    headers.set('Authorization', 'Bearer '+ token)

    return this._http.post(this.studentUrl , obj , {headers:headers}).pipe(
      catchError( e => this.handleError(e))
    )
  }

  updateStudent(obj){
    let headers = new Headers();
    let token = localStorage.getItem('auth');
    headers.set('Authorization', 'Bearer '+ token)
    console.log('service',obj);
    return this._http.put(this.studentUrl  , obj , {headers:headers}).pipe(
      catchError( e => this.handleError(e))
    )

  }

  handleError(error:any){
    if( error.status == 401 ){
      this.router.navigate(['login']);
    }
    console.log('error',error);
    return error;
  }
}
