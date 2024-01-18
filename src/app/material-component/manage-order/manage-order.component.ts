import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {CategoryService} from '../../services/category.service';
import {ProductService} from '../../services/product.service';
import {BillService} from '../../services/bill.service';
import {SnackBarService} from '../../services/snack-bar.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {GlobalConstants} from '../../shared/global-constants';
import {saveAs} from 'file-saver';
import {MatTableDataSource} from '@angular/material/table';

const invalidNumber = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value || '';
  const isNumeric: boolean = !isNaN(+value);

  if (!isNumeric) {
    return {invalidNumber: true};
  }

  if (Number(value) <= 0) {
    return {invalidNumber: true};
  }

  return null;
};

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  public displayedColumns: string [] = ['id', 'name', 'category', 'price', 'quantity', 'total', 'edit'];
  public dataSource: any[] = [];

  public manageOrderForm!: FormGroup;
  public categories: any[] = [];
  public products: any[] = [];
  private responseMessage!: string;
  public totalAmount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billService: BillService,
    private snackBarService: SnackBarService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.getCategories();

    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required, invalidNumber]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  private getCategories(): void {
    this.categoryService.getFilteredCategories().subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        this.categories = resp;
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

  getProductsByCategory(category: any): void {
    console.log('getProductsByCategory');
    this.productService.getProductByCategory(category.id).subscribe({
      next: resp => {
        this.products = resp;

        this.manageOrderForm.controls?.price.setValue(null);
        this.manageOrderForm.controls?.quantity.setValue(null);
        this.manageOrderForm.controls?.total.setValue(null);
      },
      error: err => {
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  getProductDetails(value: any): void {
    console.log('getProductDetails()');
    this.productService.getProductById(value).subscribe({
      next: resp => {
        this.manageOrderForm.controls?.price.setValue(resp.price);
        this.manageOrderForm.controls?.quantity.setValue(1);
        this.manageOrderForm.controls?.total.setValue(resp.price);
      },
      error: err => {
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  setQuantity(value: any): void {
    this.manageOrderForm.controls?.total.setValue(
      this.manageOrderForm.controls?.quantity.value *
      this.manageOrderForm.controls?.price.value
    );
  }

  validateProductAdd(): boolean {
    if (this.manageOrderForm?.controls?.quantity.value <= 0 ||
      this.manageOrderForm?.controls?.total.value <= 0 ||
      this.manageOrderForm?.controls?.total.value === null
    ) {
      return true;
    }
    return false;
  }

  add(): void {
    const found: boolean = !!this.dataSource.find((item: any) => {
      return item?.id === this.manageOrderForm.controls.product.value.id;
    });

    if (found) {
      this.snackBarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
      return;
    }

    this.dataSource.push({
        id: this.manageOrderForm.controls.product?.value?.id,
        name: this.manageOrderForm.controls.product?.value?.name,
        category: this.manageOrderForm.controls.category?.value.name,
        quantity: this.manageOrderForm.controls.quantity?.value,
        price: this.manageOrderForm.controls.price?.value,
        total: this.manageOrderForm.controls.total?.value
      }
    );

    this.dataSource = [...this.dataSource]; // needed in order to update the table
    this.totalAmount += this.manageOrderForm.controls.total?.value;
    this.snackBarService.openSnackBar(this.manageOrderForm.controls.product?.value?.name + ' added to Bill successfully', '');
  }

  validateSubmit(): boolean {
    if (this.totalAmount === 0 || this.manageOrderForm.controls.name.value === null || this.manageOrderForm.controls.email.value === null ||
      this.manageOrderForm.controls.contactNumber.value === null || this.manageOrderForm.controls.contactNumber.value === null ||
      this.manageOrderForm.controls.paymentMethod.value === null) {
      return true;
    }
    return false;
  }

  submitAction(): void {
    const data = {
      name: this.manageOrderForm.controls.name.value,
      contactNumber: this.manageOrderForm.controls.contactNumber.value,
      email: this.manageOrderForm.controls.email.value,
      paymentMethod: this.manageOrderForm.controls.paymentMethod.value,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    };

    this.ngxUiLoaderService.start();

    this.billService.generateReport(data).subscribe({
      next: resp => {
        this.downloadFile(resp.message.split(':')[1]);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      error: err => {
        this.ngxUiLoaderService.stop();
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(' Generate PDF:' + this.responseMessage, GlobalConstants.error);
      }
    });
  }

  private downloadFile(uuid: string): void {
    const data = {
      uuid: uuid
    };

    this.billService.getPdf(data).subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        saveAs(resp, uuid + '.pdf');
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

  handleRemove(element: any, index: any): void {
    this.totalAmount -= element.total;
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
  }
}
