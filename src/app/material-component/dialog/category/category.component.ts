import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../../services/category.service';
import {SnackBarService} from '../../../services/snack-bar.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GlobalConstants} from '../../../shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory: EventEmitter<any> = new EventEmitter();
  onEditCategory: EventEmitter<any> = new EventEmitter;
  categoryForm!: FormGroup;
  dialogAction = 'Add';
  responseMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private snackBarService: SnackBarService,
    private matDialogRef: MatDialogRef<CategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
    console.log('ngInit');
    if (this.dialogData.actionPerform === 'edit') {
      this.dialogAction = 'Edit';
      this.categoryForm.patchValue(this.dialogData.selectedCategory);
    }
  }

  handleSubmit(): void {
    if (this.dialogData.actionPerform === 'edit') {
      this.update();
    } else {
      this.add();
    }
  }

  private update() {
    const data = {
      id: this.dialogData.selectedCategory.id,
      name: this.categoryForm.controls?.name.value
    };

    this.categoryService.update(data).subscribe({
      next: resp => {
        this.matDialogRef.close();
        this.onEditCategory.emit();
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

  private add(): void {
    const data = {
      name: this.categoryForm.controls?.name.value
    };

    this.categoryService.add(data).subscribe({
      next: resp => {
        this.matDialogRef.close();
        this.onAddCategory.emit();
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
}
