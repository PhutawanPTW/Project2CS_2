import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { HttpClient } from '@angular/common/http';
import { Register, User } from '../model/model';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(protected api: ApiService, private http: HttpClient, private router: Router) {}

  public users: User[] = [];
  public userData: User | undefined;

  async getUser() {
    this.users = await this.api.getUser() || [];
  }

  async register(body: Register) {
    const success = await this.api.register(body);
    if (success)
      this.getUser();
    if (confirm("ลงทะเบียนสำเร็จ เข้าสู่หน้าล็อกอิน?")) 
    this.router.navigate(['/login']);
  }

}
