import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent} from '../../../material-component/dialog/confirmation/confirmation.component';
import {ChangePasswordComponent} from '../../../material-component/dialog/change-password/change-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  constructor(private router: Router,
              private matDialog: MatDialog) {
  }

  logout(): void {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = {
      messageX: 'Logout',
      confirmation: true
    };

    const popup = this.matDialog.open(ConfirmationComponent, matDialogConfig);

    popup.componentInstance.onEmitStatusChange.subscribe(
      {
        next: (): void => {
          popup.close();
          localStorage.clear();
          this.router.navigate(['/']);
        }
      }
    );
  }

  changePassword(): void {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '500px';
    this.matDialog.open(ChangePasswordComponent, matDialogConfig);
  }
}
