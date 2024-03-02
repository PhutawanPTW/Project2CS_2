import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { ShareService } from '../../../services/share.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../model/model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  
   
  constructor(private router: Router, protected shareData: ShareService) {
    localStorage.clear();
    this.shareData.getUser()
    console.log(this.shareData);
   }

   
  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToMain() {
    this.router.navigate(['/']);
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
        this.navigateToMain();
        localStorage.setItem("userID" , JSON.stringify(foundUser.userID));
        console.log("Session ID : " + foundUser.userID + " is set on LocalStorage");
      } else {
        alert("รหัสผ่านไม่ถูกต้อง");
      }
    } else {
      alert("ไม่มีผู้ใช้นี้อยู่ในระบบ โปรดสมัครสมาชิก");
    }
  }

 

  
  }
