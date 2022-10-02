import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  decodeToken,
  verifyLocalStorageToken,
  verifySessionStorageToken,
} from 'src/app/utilities/jwt.util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSub = new BehaviorSubject<boolean>(false);

  constructor() {}

  onLogin = () => {
    return this.authSub.next(
      verifySessionStorageToken() || verifyLocalStorageToken()
    );
  };

  getStorageSub = (): Observable<boolean> => {
    this.onLogin();
    return this.authSub.asObservable();
  };
}

@Injectable({
  providedIn: 'root',
})
export class LoginAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isValidLocalStorageToken = verifyLocalStorageToken();
    const isValidSessionStorageToken = verifySessionStorageToken();

    if (isValidLocalStorageToken) {
      const token =
        localStorage.getItem('token') != '' ? localStorage.getItem('token') : '';
      if (parseInt(decodeToken(token ? token : '').Role) === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (parseInt(decodeToken(token ? token : '').Role) === 0) {
        this.router.navigate(['/scribe/dashboard']);
      }
      return false;
    } else if (isValidSessionStorageToken) {
      const token =
        sessionStorage.getItem('token') != '' ? sessionStorage.getItem('token') : '';
      if (parseInt(decodeToken(token ? token : '').Role) === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (parseInt(decodeToken(token ? token : '').Role) === 0) {
        this.router.navigate(['/scribe/dashboard']);
      }
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isValidLocalStorageToken = verifyLocalStorageToken();
    const isValidSessionStorageToken = verifySessionStorageToken();

    if (isValidLocalStorageToken || isValidSessionStorageToken) {
      return true;
    }
    this.router.navigate(['/']);
    sessionStorage.setItem('token', '');
    localStorage.setItem('token', '');
    return false;
  }
}
