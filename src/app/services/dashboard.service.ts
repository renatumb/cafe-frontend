import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient) {
  }

  public getDetails(): Observable<any> {
    return this.httpClient.get(
      this.apiUrl + '/dashboard/details'
    );
  }
}
