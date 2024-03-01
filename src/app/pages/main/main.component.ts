import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit{
  imagePath: string = 'https://cdn.pixabay.com/photo/2019/05/19/15/02/sea-4214277_1280.jpg';
  imagePath1: string = 'https://cdn.pixabay.com/photo/2017/09/17/20/11/paris-2759620_1280.jpg';
  imageCredits = ['Photograph by John Doe', 'Photograph by Jane Smith'];
  OrImage: string = 'assets/Image/3724086.png';
userLoggedIn: any;

  ngOnInit(): void {
    // คุณสามารถทำสิ่งอื่น ๆ ที่ต้องการทำใน OnInit ได้ตรงนี้
  }
  constructor(private router: Router) {}

  logoPath: string = 'assets/Image/log_View.png';

  navigateToMain() {
    this.router.navigate(['']);
  }
}
