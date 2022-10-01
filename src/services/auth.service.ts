import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { verifyToken } from 'src/app/utilities/jwt.util';
import {
  clearLoginInformation,
  getUserRole,
} from 'src/app/utilities/localStorage.util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSub = new BehaviorSubject<boolean>(false);
  private roleSub = new BehaviorSubject<number>(0);

  constructor() {}
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
    const isValidToken = verifyToken();

    if (isValidToken) {
      if (getUserRole() != null && getUserRole() === 0) {
        this.router.navigate(['/admin/dashboard']);
      } else if (getUserRole() != null && getUserRole() === 1) {
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
    const isValidToken = verifyToken();

    if (isValidToken) {
      return true;
    }
    this.router.navigate(['/']);
    localStorage.setItem('token', '');
    clearLoginInformation();
    return false;
  }
}
