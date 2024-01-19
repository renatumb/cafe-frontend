import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  api: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  public generateReport(data: any): Observable<any> {
    return this.httpClient.post(
      this.api + '/bill/generateReport',
      data,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public getBills(): Observable<any> {
    return this.httpClient.get(
      this.api + '/bill/getBills',
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }

  public getPdf(data: any): Observable<any> {
    return this.httpClient.post(
      this.api + '/bill/getPdf',
      data,
      {
        headers: new HttpHeaders().set('Accept', 'application/pdf'),
        responseType: 'blob'
      }
    );
  }

  public deleteBill(id: string): Observable<any> {
    return this.httpClient.get(
      this.api + '/bill/delete/' + id,
      {headers: new HttpHeaders().set('Content-type', 'application/json')}
    );
  }
}
