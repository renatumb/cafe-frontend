import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {GlobalConstants} from '../shared/global-constants';
import {SnackBarService} from '../services/snack-bar.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword: boolean = true;
  responseMessage: string = '';
  loginForm!: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: SnackBarService,
              private ngxUiLoaderService: NgxUiLoaderService,
              private matDialogRef: MatDialogRef<LoginComponent>,
              private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    });
  }

  handleSubmit(): void {
    this.ngxUiLoaderService.start();

    const data = {
      email: this.loginForm.controls?.email.value,
      password: this.loginForm.controls?.password.value,
    };

    this.userService.login(data).subscribe({
      next: (response): void => {
        this.stopLoaderCloseModal();
        localStorage.setItem('token', response?.token);
        this.router.navigate(['/cafe']);
      },
      error: (err): void => {
        this.stopLoaderCloseModal();
        this.responseMessage = GlobalConstants.genericError;
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });

  }

  private stopLoaderCloseModal(): void {
    this.ngxUiLoaderService.stop();
    this.matDialogRef.close();
  }
}
