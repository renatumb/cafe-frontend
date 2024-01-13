import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {SnackBarService} from '../services/snack-bar.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MatDialogRef} from '@angular/material/dialog';
import {GlobalConstants} from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  responseMessage: string = '';

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: SnackBarService,
              private ngxUiLoaderService: NgxUiLoaderService,
              private matDialogRef: MatDialogRef<ForgotPasswordComponent>) {
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  handleSubmit(): void {
    this.ngxUiLoaderService.start();
    const data = {
      email: this.forgotPasswordForm?.controls?.email.value
    };

    this.userService.forgotPassword(data).subscribe({
      next: response => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = response?.message;
        this.matDialogRef.close();
        this.snackBar.openSnackBar(this.responseMessage, '');
      },
      error: (errorResponse): void => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = GlobalConstants.genericError;
        if (errorResponse.error?.message) {
          this.responseMessage = errorResponse.error?.message;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });

  }
}
