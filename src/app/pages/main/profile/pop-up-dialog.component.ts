// pop-up-dialog.component.ts
import { Component } from '@angular/core';

@Component({
 selector: 'app-pop-up-dialog',
 templateUrl: './pop-up-dialog.component.html',
 styleUrls: ['./pop-up-dialog.component.scss']
})
export class PopUpDialogComponent {
 showDialog = false;

 openDialog() {
    this.showDialog = true;
 }

 closeDialog() {
    this.showDialog = false;
 }
}
