import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { verifyToken } from 'src/app/utilities/jwt.util';
import { getUserRole } from 'src/app/utilities/localStorage.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if(verifyToken()){
      if(getUserRole() && getUserRole() === 0){
        this.router.navigate(['/dashboard']);
      } else if(getUserRole() && getUserRole() === 1){
        //TODO
      }
    }
  }

  login(){
    
  }

}
