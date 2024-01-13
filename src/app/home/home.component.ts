import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SignupComponent} from '../signup/signup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private matDialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  handleSignupAction(): void {
    const matDialogConfig: MatDialogConfig<any> = new MatDialogConfig();
    matDialogConfig.width = '600px';
    this.matDialog.open(SignupComponent, matDialogConfig);
  }
}
