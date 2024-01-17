import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {SnackBarService} from '../../services/snack-bar.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {GlobalConstants} from '../../shared/global-constants';
import {ProductComponent} from '../product/product.component';
import {ConfirmationComponent} from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  public displayedColumns = ['id', 'name', 'categoryName', 'description', 'price', 'edit'];
  public dataTable!: MatTableDataSource<any>;
  private responseMessage!: string;

  constructor(
    private productService: ProductService,
    private snackBarService: SnackBarService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private router: Router,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.loadTable();
  }

  private loadTable(): void {
    this.productService.getAllProduct().subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        this.dataTable = new MatTableDataSource(resp);
      }, error: err => {
        this.ngxUiLoaderService.stop();
        console.warn(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataTable.filter = filterValue.trim().toLowerCase();
  }

  handleAddProduct(): void {
    const configPopUp: MatDialogConfig = new MatDialogConfig();

    configPopUp.width = '850px';
    configPopUp.data = {
      action: 'add'
    };

    const popup: MatDialogRef<ProductComponent> = this.matDialog.open(ProductComponent, configPopUp);

    popup.componentInstance.onAddProduct.subscribe(
      (resp): void => {
        this.loadTable();
      }
    );
  }

  handleEditProduct(product: any): void {
    const configPopUp: MatDialogConfig = new MatDialogConfig();

    configPopUp.width = '850px';
    configPopUp.data = {
      action: 'edit',
      product: product
    };

    const popup: MatDialogRef<ProductComponent> = this.matDialog.open(ProductComponent, configPopUp);

    popup.componentInstance.onUpdateProduct.subscribe(
      (resp): void => {
        this.loadTable();
      }
    );
  }

  handleDeleteProduct(product: any): void {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      messageX: ' delete [' + product.id + '|' + product.name + ']',
      confirmation: true
    };

    const popup: MatDialogRef<ConfirmationComponent> = this.matDialog.open(ConfirmationComponent, matDialogConfig);

    popup.componentInstance.onEmitStatusChange.subscribe(
      {
        next: (): void => {
          this.ngxUiLoaderService.start();
          //
          this.productService.deleteProduct(product.id).subscribe({
            next: resp => {
              this.snackBarService.openSnackBar(resp?.message, '');
              this.loadTable();
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
          popup.close();
        }
      }
    );
  }

  ToggleActivateProduct(checked: boolean, selectedProduct: any): void {
    this.ngxUiLoaderService.start();
    const data = {
      id: selectedProduct.id,
      status: checked
    };

    this.productService.updateStatus(data).subscribe({
      next: resp => {
        this.snackBarService.openSnackBar(resp?.message, '');
        this.loadTable();
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
}
