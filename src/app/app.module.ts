import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routes  } from './app.routing';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from  '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StudentComponent } from './students/students.component';
import { LoginService } from './login.service';
import { StudentService } from './student.service';
import { FilterPipe } from './filter.pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';


import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    //HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    PaginationModule.forRoot()
  ],
  providers: [LoginService , StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
