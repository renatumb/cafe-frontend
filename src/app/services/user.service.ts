import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  public signup(data: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/user/signup',
      data,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  public forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/user/forgotPassword',
      data,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  public login(data: any): Observable<any> {
    return this.httpClient.post(
        this.url + '/user/login',
        data,
        {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  public checkToken(): Observable<any> {
    return this.httpClient.get(this.url + '/user/checkToken');
  }
  public changePassword(data: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/user/changePassword',
      data,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  public getUsers(): Observable<any> {
    return this.httpClient.get(
      this.url + '/user/get',
    );
  }

  public updateStatus(data: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/user/update',
      data,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }
}
