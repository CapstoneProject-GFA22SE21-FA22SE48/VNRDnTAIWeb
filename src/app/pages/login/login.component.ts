import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { verifyToken } from 'src/app/utilities/jwt.util';
import {
  getUserRole,
  saveLoginInformation,
} from 'src/app/utilities/localStorage.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../common/paths';
import { IsLoadingService } from '@service-work/is-loading';
import { User } from 'src/app/models/General.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  user: any;
  isRememeber: boolean = false;

  loginFailed: boolean = false;
  loginFailedText: string =
    '';

  constructor(
    private router: Router,
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {}

  ngOnInit(): void {
    if (verifyToken()) {
      if (getUserRole() != null && getUserRole() === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (getUserRole() != null && getUserRole() === 1) {
        this.router.navigate(['/scribe/manage-laws']);
      }
    } 
  }

  login() {
    this.isLoadingService.add();
    this.wrapperService.post(
      paths.Login,
      { username: this.username, password: this.password },
      null,
      {
        successCallback: (response) => {
          localStorage.setItem('token', response.data?.token);
          saveLoginInformation(response.data.user);
          this.loginFailed = false;
          if(response.data?.user?.role === 0){
            this.router.navigate(['/admin/dashboard']);
          }else if(response.data?.user?.role === 1){
            this.router.navigate(['/scribe/dashboard']);
          }                                                            
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          this.loginFailed = true;
          this.loginFailedText = error?.response?.data
          this.isLoadingService.remove();
        },
      }
    );
  }
}
