import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {
  }

  public isAuthenticated(): boolean {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
