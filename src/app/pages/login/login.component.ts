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
  user: User | undefined;

  loginFailed: boolean = false;
  loginFailedText: string =
    'Login failed!! Please check your login information and try again...';

  constructor(
    private router: Router,
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {}

  ngOnInit(): void {
    if (verifyToken()) {
      if (getUserRole() && getUserRole() === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (getUserRole() && getUserRole() === 1) {
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
          // localStorage.setItem('token', response.token);
          // saveLoginInformation(response.user);
          this.user = response;
          // this.router.navigate(['/admin/dashboard']);
          this.loginFailed = false;
          console.log(this.user);
                                                                      
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.loginFailed = true;
        },
      }
    );
  }
}
