import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-your-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class DialogComponent implements OnInit {
  winner: any;
  loser: any;
  winnerOldScore: number;
  loserOldScore: number;
  winnerExpectedScore: number;
  loserExpectedScore: number;
  plus: number;
  minus: number;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.winner = data.winner;
    this.loser = data.loser;
    this.winnerOldScore = data.winnerOldScore;
    this.loserOldScore = data.loserOldScore;
    this.winnerExpectedScore = data.winnerExpectedScore;
    this.loserExpectedScore = data.loserExpectedScore;
    this.plus = data.plus;
    this.minus = data.minus;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 300000);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
