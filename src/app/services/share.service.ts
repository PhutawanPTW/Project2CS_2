import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { HttpClient } from '@angular/common/http';
import { Register, User, imageUpload } from '../model/model';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ShareService {
  votedImageIds: any;
  constructor(
    protected api: ApiService,
    private http: HttpClient,
    private router: Router
  ) {
    this.getImage();
  }

  public users: User[] = [];
  public images: imageUpload[] = [];

  public userData: User | undefined;
  public imageData: imageUpload | undefined;

  async getUser() {
    this.users = (await this.api.getUser()) || [];
    console.log('Users:', this.users);
  }

  async getImage() {
    this.images = (await this.api.getImage()) || [];
    console.log('Images:', this.images);
  }

  async register(body: Register) {
    const success = await this.api.register(body);
    if (success) this.getUser();
    if (confirm('ลงทะเบียนสำเร็จ เข้าสู่หน้าล็อกอิน?'))
      this.router.navigate(['/login']);
  }
}
