import {Component, Inject, EventEmitter, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange: EventEmitter<any> = new EventEmitter();
  details: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.details = {
      message: 'FROM Constructor'
    };
  }

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.confirmation) {
      this.details = this.dialogData;
    }
  }
}
