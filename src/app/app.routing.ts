import { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { StudentComponent } from "./students/students.component";

 export const routes : Route[] = [
    { path:'', redirectTo:'login', pathMatch:'full'},
    { path:'login' , component: LoginComponent},
    { path:'students' , component: StudentComponent}
   
        
]

