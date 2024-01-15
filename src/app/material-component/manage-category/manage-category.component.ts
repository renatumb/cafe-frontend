import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {SnackBarService} from '../../services/snack-bar.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {GlobalConstants} from '../../shared/global-constants';
import {CategoryComponent} from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'edit'];
  dataSource: any;
  responseMessage!: string;

  constructor(
    private categoryService: CategoryService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private matDialog: MatDialog,
    private snackBarService: SnackBarService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.tableData();
  }

  private tableData(): void {
    this.categoryService.getCategories().subscribe({
      next: value => {
        this.ngxUiLoaderService.stop();
        this.dataSource = new MatTableDataSource(value);
      },
      error: err => {
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
    const filter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  handleAddAction(): void {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      actionPerform: 'add'
    };
    matDialogConfig.width = '600px';

    const popup: MatDialogRef<CategoryComponent> = this.matDialog.open(CategoryComponent, matDialogConfig);

    popup.componentInstance.onAddCategory.subscribe((resp) => {
      this.tableData();
    });
  }

  handleEditAction(element: any): void {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      actionPerform: 'edit',
      selectedCategory: element
    };
    matDialogConfig.width = '600px';
    const popup: MatDialogRef<CategoryComponent> = this.matDialog.open(CategoryComponent, matDialogConfig);

    popup.componentInstance.onEditCategory.subscribe((resp) => {
      this.tableData();
    });
  }
}
