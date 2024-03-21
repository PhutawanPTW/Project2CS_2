import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Register, UpdateUser } from '../../../model/model';
import { ApiService } from '../../../services/api-service';

@Component({
  selector: 'app-update-profile-dialog',
  standalone: true,
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: ['./update-profile-dialog.component.scss'],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class UpdateProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  protected requestBody!: UpdateUser;

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFieldEmpty(...fields: string[]): boolean {
    if (fields.some((field) => !field)) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return true;
    }
    return false;
  }

  isPasswordMismatch(password: string, confirm: string): boolean {
    if (password !== confirm) {
      alert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return true;
    }
    return false;
  }
}
