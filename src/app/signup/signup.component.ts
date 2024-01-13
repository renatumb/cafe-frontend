import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {SnackBarService} from '../services/snack-bar.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MatDialogRef} from '@angular/material/dialog';
import {GlobalConstants} from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  passwordHide = true;
  confirmPassword = true;
  signupForm!: FormGroup;
  responseMessage!: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private snackbar: SnackBarService,
              private ngxUiLoaderService: NgxUiLoaderService,
              public matDialogRef: MatDialogRef<SignupComponent>
  ) {
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });
  }

  validateSubmit(): boolean {
    if (this.signupForm.controls?.password.value != this.signupForm.controls?.confirmPassword.value) {
      return true;
    }
    return false;
  }

  handleSubmit(): void {
    this.ngxUiLoaderService.start();

    const data = {
      name: this.signupForm.controls?.name.value,
      email: this.signupForm.controls?.email.value,
      contactNumber: this.signupForm.controls?.contactNumber.value,
      password: this.signupForm.controls?.password.value,
    };

    this.userService.signup(data).subscribe({
      next: (response) => {
        this.ngxUiLoaderService.stop();
        this.matDialogRef.close();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage, '');
        this.router.navigate(['/']);
      },
      error: (errorResponse): void => {
        this.ngxUiLoaderService.stop();
        this.responseMessage = GlobalConstants.genericError;
        if (errorResponse.error?.message) {
          this.responseMessage = errorResponse.error?.message;
        }
        this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });

  }
}
