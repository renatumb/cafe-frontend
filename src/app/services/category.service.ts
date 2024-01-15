import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  public add(data: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/category/add',
      data,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }

  public getCategories(): Observable<any> {
    return this.httpClient.get(
      this.url + '/category/get'
    );
  }

  public update(data: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/category/update',
      data,
      {headers: new HttpHeaders().set('Content-Type', 'application/json')}
    );
  }
}
