import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {SnackBarService} from './snack-bar.service';
import {GlobalConstants} from '../shared/global-constants';
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private authService: AuthService,
              private router: Router,
              private snackBarService: SnackBarService) {
  }

  public canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
    const expectedRoleArray: [string] = activatedRouteSnapshot?.data?.expectedRole;
    const token: any = localStorage.getItem('token');
    let tokenPayload: any;
    let expectedRole: string | null = null;
    try {
      tokenPayload = jwtDecode(token);
    } catch (e) {
      localStorage.clear();
      this.router.navigate(['/']);
    }

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] === tokenPayload.role) {
        expectedRole = tokenPayload.role;
      }
    }

    if (tokenPayload.role === 'user' || tokenPayload.role === 'admin') {
      if (this.authService.isAuthenticated() && tokenPayload.role === expectedRole) {
        return true;
      }
      this.snackBarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/cafe']);
      return false;
    }

    this.router.navigate(['/']);
    localStorage.clear();
    return false;
  }
}
