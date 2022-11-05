import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { decodeToken, verifyLocalStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../common/paths';
import { IsLoadingService } from '@service-work/is-loading';
import { User } from 'src/app/models/General.model';
import jwtDecode from 'jwt-decode';

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
    if (verifyLocalStorageToken()) {
      const token = localStorage.getItem('token');
      if(decodeToken(token ? token : '') !== null) {
        if (parseInt(decodeToken(token ? token : '')?.Role) === 0) {
          this.router.navigate(['/admin/dashboard']);
        } else if (parseInt(decodeToken(token ? token : '')?.Role) === 1) {
          this.router.navigate(['/scribe/manage-laws']);
        }
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
          sessionStorage.setItem('token', response?.data?.token);
          if(this.isRememeber){
            localStorage.setItem('token', response?.data?.token);
          }
          this.loginFailed = false;
          const token = sessionStorage.getItem('token')
          if(parseInt(decodeToken( token ? token : '')?.Role) === 0){
            this.router.navigate(['/admin/dashboard']);
          }  else if(parseInt(decodeToken(token ? token : '')?.Role) === 1){
            this.router.navigate(['/scribe/my-request']);
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
