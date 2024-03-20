import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User, imageUpload, imageUser } from '../../../model/model';
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
  public images: imageUser[] = [];
  httpError: boolean = false;
  imageCount: number = 0;
  isAddIconTransformed: boolean = false;
  selectedFile: File | undefined;
  uploading: boolean = false;
  userData: User | undefined;
  deleteSelect: number[] = [];
  async ngOnInit() {
    this.checkLogin();
    this.setData();
    this.getImage();
  }

  async getImage() {
    await this.shareData.getImage(this.id);
    this.images = this.shareData.images;
    this.imageCount = this.images.length;
  }

  setData() {
    this.id = localStorage.getItem('userID');
    const userDataString = localStorage.getItem('userData');
    this.userData = userDataString ? JSON.parse(userDataString) : null;
  }

  checkLogin() {
    if (!localStorage.getItem('userData') || !localStorage.getItem('userID')) {
      this.navigateToLogin();
    }
  }

  toggleTransform(id: number, event: Event) {
    const findIndex = this.deleteSelect.findIndex((item) => item === id);
    const icon = event.currentTarget as HTMLElement;
    icon.classList.toggle('transformed');
    if (findIndex !== -1) {
      this.deleteSelect.splice(findIndex, 1);
    } else {
      this.deleteSelect.push(id);
    }
    console.log(this.deleteSelect);
  }

  // async loadData() {
  //   if (!this.id) {
  //     return;
  //   }
  //   this.shareData.userData = await this.api.getUserbyId(this.id);
  //   localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
  //   console.log(this.shareData.userData);
  // }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async sendFile(userID: string) {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    if (this.images.length >= 5) {
      window.alert('Cannot upload more than 5 images');
      this.selectedFile = undefined;
      return;
    }

    try {
      this.uploading = true;
      const uploadedImage = await this.api.uploadImage(
        this.selectedFile,
        userID
      );
      console.log('Uploaded image:', uploadedImage);

      await this.getImage();

      this.selectedFile = undefined;
      window.alert('Image uploaded successfully');
    } catch (error) {
      this.selectedFile = undefined;
      console.error('Error uploading image:', error);
      window.alert('Failed to upload image');
    } finally {
      this.uploading = false;
    }
  }

  uploadProfileImage(event: any) {
    const file = event.target?.files[0];
  }

  async deleteImage(id: number) {
    const userConfirmed = window.confirm('Do you want to delete this image?');

    if (userConfirmed) {
      const status = await this.api.deleteImagebyId(id);
      window.location.reload();
    } else {
      console.log('Canceled image deletion');
    }
  }

  async deleteAllImage() {
    if (!this.deleteSelect || this.deleteSelect.length === 0) {
      window.alert('Please select an image');
    } else {
      const userConfirmed = window.confirm(
        'Do you want to delete the selected images?'
      );
      if (userConfirmed) {
        for (const i of this.deleteSelect) {
          const status = await this.api.deleteImagebyId(i);
        }
        this.deleteSelect = [];
        window.location.reload();
      } else {
        console.log('Canceled image deletion');
      }
    }
  }

  navigateChart(imageId: number) {
    this.router.navigate(['/chart', imageId]);
  }

  navigateToMain() {
    this.router.navigate(['/']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
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
