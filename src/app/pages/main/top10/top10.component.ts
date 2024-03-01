import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [MatFormFieldModule,MatToolbarModule],
  templateUrl: './top10.component.html',
  styleUrl: './top10.component.scss',
})
export class Top10Component {}
