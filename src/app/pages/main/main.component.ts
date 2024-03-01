import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { User } from '../../model/model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  id!: number;
  userData: User | undefined; // Adjusted to use 'userData' property directly

  constructor(private route: ActivatedRoute, protected shareData: ShareService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.fetchUserData();
    });
  }

  async fetchUserData() {
    await this.shareData.getUserbyId(this.id);
    this.userData = this.shareData.userData; // Assign the value after fetching
    console.log(this.userData?.image);
  }
}