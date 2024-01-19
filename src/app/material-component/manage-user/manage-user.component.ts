import {Component, OnInit} from '@angular/core';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SnackBarService} from '../../services/snack-bar.service';
import {UserService} from '../../services/user.service';
import {GlobalConstants} from '../../shared/global-constants';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  public displayedUserColumn: string [] = ['name', 'email', 'contactNumber', 'status'];
  public dataSource!: MatTableDataSource<any>;
  private responseMessage!: string;

  constructor(
    private ngxUiLoaderService: NgxUiLoaderService,
    private snackBarService: SnackBarService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.ngxUiLoaderService.start();
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: resp => {
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
      }, complete: (): void => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.toLowerCase();
  }

  onChange(status: boolean, id: number): void {
    this.ngxUiLoaderService.start();

    const data = {
      status: status,
      id: id
    };

    this.userService.updateStatus(data).subscribe({
      next: resp => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = resp.message;
        this.snackBarService.openSnackBar(this.responseMessage, '');
      }, error: err => {
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
