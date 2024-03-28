import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Register, UpdateUser } from '../../../../model/model';
import { ApiService } from '../../../../services/api-service';

@Component({
  selector: 'app-update-profile-dialog',
  standalone: true,
  templateUrl: './update-password-dialog.component.html',
  styleUrls: ['./update-password-dialog.component.scss'],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class UpdatePasswordDialogComponent implements OnInit{

userData : any;

  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordDialogComponent>,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  protected requestBody!: UpdateUser;

  ngOnInit(): void {
    this.setUser();
    console.log(this.userData);
  }

  setUser() {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }



  

  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    // ตรวจสอบว่ามีการป้อนรหัสผ่านเก่าและรหัสผ่านใหม่
    if (!oldPassword || !newPassword || !confirmPassword) {
        alert("โปรดกรอกข้อมูลทั้งหมด");
        return;
    }

    // ตรวจสอบว่ารหัสผ่านใหม่ตรงกับการยืนยันรหัสผ่านหรือไม่
    if (newPassword !== confirmPassword) {
        alert("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
        return;
    }

    // ตรวจสอบว่ารหัสผ่านเก่าตรงกับที่เก็บไว้หรือไม่
    if (oldPassword !== this.userData.password) {
        alert("รหัสผ่านเก่าไม่ถูกต้อง");
        return;
    }
    let update = [
      {
        "oldPassword" : oldPassword ,
        "newPassword" : newPassword 
      }
    ]
    let response = await this.api.userUpdate(this.userData.userID, update);
    if (response) {
      this.userData.password = newPassword;
      localStorage.setItem("userData", JSON.stringify(this.userData));
      alert("การเปลี่ยนรหัสผ่านเสร็จสมบูรณ์");
      window.location.reload();
  }
   
}
}
