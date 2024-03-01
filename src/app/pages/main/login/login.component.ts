import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { ShareService } from '../../../services/share.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  
   
  constructor(private router: Router, protected shareData: ShareService) {
    
   }

   
  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToMain(id: number) {
    this.router.navigate(['/main', id]);
    // this.shareData.getUserbyId(id);
  }

  login(user: string, password: string) {
    if (user.trim() === "" || password === "") {
      alert("โปรดกรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง");
      return;
    }
  
    const foundUser = this.shareData.users.find(userData =>
      user === userData.username || user === userData.email
    );
  
    if (foundUser) {
      console.log("User found:", foundUser);
      if (password === foundUser.password) {
        this.navigateToMain(foundUser.userID);
      } else {
        alert("รหัสผ่านไม่ถูกต้อง");
      }
    } else {
      alert("ไม่มีผู้ใช้นี้อยู่ในระบบ โปรดสมัครสมาชิก");
    }
  }
  }
