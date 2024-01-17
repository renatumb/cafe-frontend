import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoryService} from '../../services/category.service';
import {SnackBarService} from '../../services/snack-bar.service';
import {GlobalConstants} from '../../shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Output()
  onAddProduct = new EventEmitter();
  @Output()
  onUpdateProduct = new EventEmitter();

  productForm!: FormGroup;
  responseMessage!: string;
  categories: any[] = [];

  constructor(
    private formBuider: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private matDialogRef: MatDialogRef<ProductComponent>,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit(): void {
    this.productForm = this.formBuider.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required]
    });

    if (this.dialogData.action === 'edit') {
      this.productForm.patchValue(this.dialogData.product);
    }

    this.getCategories();
  }

  private getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: resp => {
        this.categories = resp;
      },
      error: err => {
        console.warn(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  handleSubmit() {
    if (this.dialogData.action === 'add') {
      this.addProduct();
    } else if (this.dialogData.action === 'edit') {
      this.updateProduct();
    }
  }

  private updateProduct(): void {
    const data = {
      id: this.dialogData.product.id,
      name: this.productForm.controls?.name.value,
      description: this.productForm.controls?.description.value,
      categoryId: this.productForm.controls?.categoryId.value,
      price: this.productForm.controls?.price.value
    };

    this.productService.update(data).subscribe({
      next: resp => {
        this.matDialogRef.close();
        this.onUpdateProduct.emit();
        this.snackBarService.openSnackBar(resp?.message, '');
      },
      error: err => {
        this.matDialogRef.close();
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  private addProduct(): void {
    const data = {
      name: this.productForm.controls?.name.value,
      description: this.productForm.controls?.description.value,
      categoryId: this.productForm.controls?.categoryId.value,
      price: this.productForm.controls?.price.value
    };

    this.productService.add(data).subscribe({
      next: resp => {
        this.matDialogRef.close();
        this.onAddProduct.emit();
        this.snackBarService.openSnackBar(resp?.message, '');
      },
      error: err => {
        this.matDialogRef.close();
        console.error(err);
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      },
    });
  }
}
