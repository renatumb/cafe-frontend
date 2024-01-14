import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SignupComponent} from '../signup/signup.component';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {LoginComponent} from '../login/login.component';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private matDialog: MatDialog,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userService.checkToken().subscribe({
      next: value => {
        console.log('home.component| ngOnInit | SUCESS');
        this.router.navigate(['/cafe']);
      },
      error: err => {
        console.error('home.component| ngOnInit | ERROR');
      }
    });
  }

  handleSignupAction(): void {
    const matDialogConfig: MatDialogConfig<any> = new MatDialogConfig();
    matDialogConfig.width = '600px';
    this.matDialog.open(SignupComponent, matDialogConfig);
  }

  handleForgotAction(): void {
    const matDialogConfig: MatDialogConfig<any> = new MatDialogConfig();
    matDialogConfig.width = '600px';
    this.matDialog.open(ForgotPasswordComponent, matDialogConfig);
  }

  handleLoginAction(): void {
    const matDialogConfig: MatDialogConfig<any> = new MatDialogConfig();
    matDialogConfig.width = '600px';
    this.matDialog.open(LoginComponent, matDialogConfig);
  }
}
