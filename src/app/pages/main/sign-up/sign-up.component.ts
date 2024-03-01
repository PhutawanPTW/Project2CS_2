import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ShareService } from '../../../services/share.service';
import { Register, User } from '../../../model/model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  constructor(private router: Router, protected shareData: ShareService) {
    
  }

  protected requestBody! : Register;

  navigateLogin() {
    this.router.navigate(['/login']);
  }

  signUp(username: string, password: string, confirm: string, email: string) {

    if (this.isFieldEmpty(username, password, confirm, email) ||
      this.isPasswordMismatch(password, confirm) ||
      !this.isValidEmail(email) ||
      this.isUsernameExists(username , email)) {
      return;
    }else{
      this.requestBody = {
        username: username,
        password: password,
        email: email,
      };
      this.shareData.register(this.requestBody);
    }    
  }

  isFieldEmpty(...fields: string[]): boolean {
    if (fields.some(field => !field)) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return true;
    }
    return false;
  }

  isPasswordMismatch(password: string, confirm: string): boolean {
    if (password !== confirm) {
      alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return true;
    }
    return false;
  }

  isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('อีเมลไม่ถูกต้อง');
      return false;
    }
    return true;
  }

  isUsernameExists(username: string , email: string): boolean {
    if (this.shareData.users.some(user => user.username === username)) {
      alert("มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว");
      return true;
    }
    if (this.shareData.users.some(user => user.email === email)) {
      alert("มีอีเมลผู้ใช้นี้อยู่ในระบบแล้ว");
      return true;
    }
    return false;
  }
}
