import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User, imageUpload } from '../../../model/model';
import { ApiService } from '../../../services/api-service';
import { ShareService } from '../../../services/share.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  public chart: any;
  constructor(
    private route: ActivatedRoute,
    protected shareData: ShareService,
    protected api: ApiService,
    private router: Router
  ) {}
  id: any;
  public images: imageUpload[] = [];
  httpError: boolean = false;

  async ngOnInit() {
    this.clearData();
    this.id = localStorage.getItem('userID');
    this.loadData();
    await this.shareData.getImage(+this.id);
    this.createChart();
    this.images = this.shareData.images;
  }

  async loadData() {
    if (!this.id) {
      return;
    }
    this.shareData.userData = await this.api.getUserbyId(this.id);

    localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
    console.log(this.shareData.userData);
  }

  navigateToMain() {
    this.router.navigate(['/']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToLogin() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.clearData();
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

  createChart(){
  
    this.chart = new Chart("MyChart", {
      type: 'line',

      data: {
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								  '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Score",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
}
