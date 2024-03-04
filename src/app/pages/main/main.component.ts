import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../model/model';
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
  currentImageIndex: number = 0;

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
    await this.shareData.getImage();

    // เรียงลำดับอาร์เรย์ของรูปภาพให้เป็นลำดับสุ่ม
    this.shareData.images = await this.shareData.shuffleArray(this.shareData.images);
  }

  changeImage() {
    // เพิ่มค่า currentImageIndex เพื่อแสดงเซ็ตรูปภาพถัดไป
    this.currentImageIndex = (this.currentImageIndex + 2) % (this.shareData.images.length - 1);
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
