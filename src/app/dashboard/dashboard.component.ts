import {Component, AfterViewInit} from '@angular/core';
import {DashboardService} from '../services/dashboard.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SnackBarService} from '../services/snack-bar.service';
import {GlobalConstants} from '../shared/global-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  responseMessage!: string;
  data!: any;

  ngAfterViewInit(): void {
  }

  constructor(private dashboardService: DashboardService,
              private ngxUiLoaderService: NgxUiLoaderService,
              private snackBarService: SnackBarService) {

    this.ngxUiLoaderService.start();
    this.getDashboardData();
  }

  private getDashboardData(): void {
    this.dashboardService.getDetails().subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        this.data = resp;
      },
      error: err => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }
}
