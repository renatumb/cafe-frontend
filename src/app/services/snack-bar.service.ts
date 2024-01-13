import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackbar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string): void {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: [(action !== 'error' ? 'green-snackbar' : 'red-snackbar')]
    });
  }

}
