import { Injectable } from '@angular/core';
import { IsLoadingService } from '@service-work/is-loading';
import { MessageService } from 'primeng/api';
import { Status } from 'src/app/common/status';
import { decodeToken, getStorageToken } from 'src/app/utilities/jwt.util';
import { WrapperService } from 'src/services/wrapper.service';
import * as paths from '../app/common/paths';
import * as commonStr from '../app/common/commonStr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ValidateAccount {
  constructor(
    private wrapperService: WrapperService,
    private isLoadingService: IsLoadingService,
    private messageService: MessageService,
    private router: Router
  ) {}

  isActiveAccount = () => {
    this.isLoadingService.add();
    this.wrapperService.get(
      paths.GetAccountInformation + '/' + decodeToken(getStorageToken() || '')?.Id,
      getStorageToken(),
      {
        successCallback: (response) => {
          if(response?.data?.status === Status.Deactivated || response?.data?.isDeleted === true){
            localStorage.setItem('token', '');
            sessionStorage.setItem('token', '');

            this.router.navigate(['/']);

            this.messageService.add({
              severity: 'error',
              summary: commonStr.fail,
              detail: 'Tài khoản đã bị ngưng hoạt động',
            });
          }

          this.isLoadingService.remove();
        },
        errorCallback: (error) => {
          console.log(error);
          this.isLoadingService.remove();
        },
      }
    );
  };
}
