import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { HttpClient } from '@angular/common/http';
import { Register, User, Vote, imageUpload, imageUser } from '../model/model';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(
    protected api: ApiService,
    private http: HttpClient,
    private router: Router
  ) {
    // this.getImage();
  }

  public users: User[] = [];
  public images: imageUser[] = [];

  public userData: User | undefined;
  public imageData: imageUpload | undefined;

  public chartData : imageUpload | undefined;

  async getUser() {
    this.users = (await this.api.getUser()) || [];
    // console.log('Users:', this.users);
  }

  async getImage(userId : number) {
    this.images = (await this.api.getImage()) || [];
    if (userId) {
      this.images = this.images.filter((image) => image.userID == userId);
    }
  }
  

  getImageCountForUser(userId: number): number {
    const userImages = this.images.filter((image) => image.userID === userId);
    return userImages.length;
  }

  async register(body: Register) {
    const success = await this.api.register(body);
    if (success) this.getUser();
    if (confirm('ลงทะเบียนสำเร็จ เข้าสู่หน้าล็อกอิน?'))
      this.router.navigate(['/login']);
  }

  
}