import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsLoadingService } from '@service-work/is-loading';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../../../common/paths';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  account: any;
  
  constructor(
    private router: Router,
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService
  ) {}

  ngOnInit(): void {
    this.getAccountInformation();
  }

  logOut() {
    sessionStorage.setItem('token', '');
    localStorage.setItem('token', '');
    this.router.navigate(['/']);
  }

  getAccountInformation() {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.GetAccountInformation +
        '/' +
        decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          this.account = response.data;          
          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  }
}
