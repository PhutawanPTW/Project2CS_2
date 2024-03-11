import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User, imageUpload } from '../../../model/model';
import { ApiService } from '../../../services/api-service';
import { ShareService } from '../../../services/share.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  url: string = 'sgshdh';
  constructor(
    private route: ActivatedRoute,
    protected shareData: ShareService,
    protected api: ApiService,
    private router: Router
  ) {}
  id: any;
  public images: imageUpload[] = [];
  httpError: boolean = false;
  imageCount: number = 0;
  isAddIconTransformed: boolean = false;
  selectedFile: File | undefined;
  uploading: boolean = false;

  async ngOnInit() {
    this.clearData();
    this.id = localStorage.getItem('userID');
    this.loadData();
    await this.shareData.getImage(+this.id);
    this.images = this.shareData.images;
    this.imageCount = this.images.length;
  }

  toggleTransform(event: MouseEvent) {
    const icon = event.currentTarget as HTMLElement;
    icon.classList.toggle('transformed'); // สลับคลาสที่กำหนดทั้ง transform และ background-color
  }

  async loadData() {
    if (!this.id) {
      return;
    }
    this.shareData.userData = await this.api.getUserbyId(this.id);

    localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
    console.log(this.shareData.userData);
  }
  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async sendFile() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      this.uploading = true; // เริ่มสถานะกำลังโหลด
      const uploadedImage = await this.api.uploadImage(this.selectedFile);
      console.log('Uploaded image:', uploadedImage);
      this.selectedFile = undefined;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error
    } finally {
      this.uploading = false; // สิ้นสถานะกำลังโหลด
    }
  }

  navigateChart() {
    this.router.navigate(['/chart']);
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

  clearData() {
    this.shareData.userData = undefined;
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  navigateTop() {
    this.router.navigate(['/top10']);
  }
}
