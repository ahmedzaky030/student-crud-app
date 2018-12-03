import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup , FormBuilder} from '@angular/forms';
import { LoginService } from '../login.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  constructor(private _fb: FormBuilder , private loginS: LoginService
    , private router : Router) { }

  ngOnInit() {
    this.loginForm = this._fb.group({      
      password:'',
      usernameOrEmail: ''
    })
  }


  submit(form:FormGroup){
    //console.log(form.value);
    this.loginS.login(form.value).subscribe(data =>{
      debugger;
      let body =JSON.parse( data['_body']);
      
      localStorage.setItem('auth', body.accessToken);
      this.router.navigate(['students']);
    })

  }

}
