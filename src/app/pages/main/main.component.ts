import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User, imageUpload } from '../../model/model';
import { ApiService } from '../../services/api-service';
import { ShareService } from '../../services/share.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    protected shareData: ShareService,
    protected api: ApiService,
    private router: Router
  ) {}

  id: any;
  leftImage: any;
  rightImage: any;

  async ngOnInit() {
    this.clearData();
    this.id = localStorage.getItem('userID');
    this.loadData();
    this.loadImages();
  }
  async loadData() {
    this.shareData.userData = await this.api.getUserbyId(this.id);
    localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
    console.log(this.shareData.userData);
  }

  async loadImages() {
    const images = await this.api.getImage();

    if (images && images.length >= 2) {
      this.shuffleImages(images);
    } else {
      console.error('Not enough images returned from the API.');
      // Handle this case based on your requirements
    }
  }

  shuffleImages(images: any[]) {
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }

    this.leftImage = images[0];
    this.rightImage = images[1];
  }

  reshuffleImages() {
    // Trigger reshuffling of images
    this.loadImages();
  }

  navigateToMain() {
    this.router.navigate(['/']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToLogin() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.clearData();
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  navigateTop() {
    this.router.navigate(['/top10']);
  }

  clearData() {
    this.shareData.userData = undefined;
  }
}
