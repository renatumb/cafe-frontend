import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {

  public displayedProductColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  public dataSourceProduct: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ViewBillProductsComponent>
  ) {
  }

  ngOnInit(): void {
    this.dataSourceProduct = JSON.parse(this.dialogData.data.productDetails);
  }
}
