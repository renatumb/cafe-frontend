import {Component, OnInit} from '@angular/core';
import {BillService} from '../../services/bill.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {SnackBarService} from '../../services/snack-bar.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {GlobalConstants} from '../../shared/global-constants';
import {ViewBillProductsComponent} from '../dialog/view-bill-products/view-bill-products.component';
import {ConfirmationComponent} from '../dialog/confirmation/confirmation.component';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'name', 'email', 'contactNumber', 'paymentMethod', 'total', 'action'];
  public dataSource!: MatTableDataSource<any>;
  responseMessage: any;

  constructor(
    private billService: BillService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private matDialog: MatDialog,
    private snackBarService: SnackBarService
  ) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.loadDataTable();
  }

  private loadDataTable(): void {
    this.billService.getBills().subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        this.dataSource = new MatTableDataSource(resp);
      },
      error: err => {
        this.ngxUiLoaderService.stop();
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  applyFilter($event: KeyboardEvent): void {
    this.dataSource.filter = ($event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  handleViewAction(element: any): void {
    const popUpConfig: MatDialogConfig = new MatDialogConfig();
    popUpConfig.width = '100%';
    popUpConfig.data = {
      data: element
    };

    this.matDialog.open(ViewBillProductsComponent, popUpConfig);
  }

  handleDownloadAction(element: any): void {
    this.ngxUiLoaderService.start();

    this.billService.getPdf(element).subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        saveAs(resp, element.uuid + '.pdf');
      },
      error: err => {
        this.ngxUiLoaderService.stop();
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar('DownLoad PDF:' + this.responseMessage, GlobalConstants.error);
      }
    });
  }

  handleDeleteAction(element: any): void {
    const popUpConfig: MatDialogConfig = new MatDialogConfig();
    popUpConfig.width = '70%';

    popUpConfig.data = {
      messageX: ' Delete Bill # ' + element.id,
      confirmation: true
    };

    const popUp: MatDialogRef<ConfirmationComponent> = this.matDialog.open(ConfirmationComponent, popUpConfig);

    popUp.componentInstance.onEmitStatusChange.subscribe(
      (resp): void => {
        this.ngxUiLoaderService.start();
        this.billService.deleteBill(element.id).subscribe(
          resp => {
            this.ngxUiLoaderService.stop();
            popUp.close();
            this.snackBarService.openSnackBar(resp.message, '');
          },
          error => {
            this.ngxUiLoaderService.stop();
            console.error(error);
            this.responseMessage = GlobalConstants.genericError;
            if (error.error?.message) {
              this.responseMessage = error.error?.message;
            }
            this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
          }, () => {
            this.loadDataTable();
          });
      }
    );
  }
}
