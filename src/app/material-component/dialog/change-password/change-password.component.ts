import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SnackBarService} from '../../../services/snack-bar.service';
import {GlobalConstants} from '../../../shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  changePasswordForm!: FormGroup;
  responseMessage!: string;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private matDialogRef: MatDialogRef<ChangePasswordComponent>,
              private ngxUiLoaderService: NgxUiLoaderService,
              private snackBarService: SnackBarService
  ) {
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  handleSubmit(): void {
    this.ngxUiLoaderService.start();

    const data = this.changePasswordForm.value;

    this.userService.changePassword(data).subscribe({
      next: value => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = value?.message;
        this.matDialogRef.close();
        this.snackBarService.openSnackBar(this.responseMessage, '');
      }, error: err => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }

  invalidFields(): boolean {
    if (this.changePasswordForm.controls?.newPassword?.value != this.changePasswordForm.controls?.confirmPassword?.value) {
      return true;
    }
    return false;
  }
}
