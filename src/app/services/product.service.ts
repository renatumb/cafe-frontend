import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  api = environment.apiUrl;

  constructor(public httpClient: HttpClient) {
  }

  public add(data: any): Observable<any> {
    return this.httpClient.post(
      this.api + '/product/add',
      data,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public update(data: any): Observable<any> {
    return this.httpClient.post(
      this.api + '/product/update',
      data,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public updateStatus(data: any): Observable<any> {
    return this.httpClient.post(
      this.api + '/product/updateStatus',
      data,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public getAllProduct(): Observable<any> {
    return this.httpClient.get(
      this.api + '/product/get',
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public getProductById(id: string): Observable<any> {
    return this.httpClient.get(
      this.api + '/product/get/' + id,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public getProductByCategory(id: string): Observable<any> {
    return this.httpClient.get(
      this.api + '/product/getByCategory/' + id,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public deleteProduct(id: string): Observable<any> {
    return this.httpClient.get(
      this.api + '/product/delete/' + id,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }
}
