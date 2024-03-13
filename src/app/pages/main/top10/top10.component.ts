import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { ShareService } from '../../../services/share.service';
import { MatIconModule } from '@angular/material/icon';
import { User, imageUpload, imageUser, rankID } from '../../../model/model';

@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './top10.component.html',
  styleUrls: ['./top10.component.scss'],
})
export class Top10Component implements OnInit {
  constructor(
    private route: ActivatedRoute,
    protected shareData: ShareService,
    protected api: ApiService,
    private router: Router
  ) {}

  Today: imageUser[] = [];
  Yesterday: imageUser[] = [];
  rank: rankID[] = [];
  id: any;
  userData: User | undefined;
  userUrls: User[] = [];
  async ngOnInit() {
    const userDataString = localStorage.getItem('userData');
    this.userData = userDataString ? JSON.parse(userDataString) : undefined;
    this.id = localStorage.getItem('userID');
    this.loadData();
    this.getTopImageData();
    
  }

  async getTopImageData() {
    this.Today = await this.api.gettodayrank();
    this.Yesterday = await this.api.getyesterdayrank();
    console.log('Today', this.Today);
    console.log('Yesterday', this.Yesterday);
    this.getRank(this.Today, this.Yesterday);
  }

  getRank(today: imageUser[], yesterday: imageUser[]): void {
    for (let i = 0; i < today.length; i++) {
        const todayImage = today[i];
        const yesterdayImage = yesterday.find(img => img.imageID === todayImage.imageID); // Use '===' for comparison
        if (yesterdayImage) {
            const difference = yesterdayImage.rankYesterday - todayImage.rankToday; // Calculate the rank difference
            const rankNow: rankID = {
                imageID: todayImage.imageID,
                rankDiff: difference,
                url : todayImage.url,
                username : todayImage.username,
                voteScore : todayImage.voteScore
            };
            this.rank.push(rankNow);
        } else {
            // Handle if the image is new today and was not present yesterday
            const rankNow: rankID = {
                imageID: todayImage.imageID,
                rankDiff: 0,
                url : todayImage.url,
                username : todayImage.username,
                voteScore : todayImage.voteScore
            };
            this.rank.push(rankNow);
        }
    }
    console.log(this.rank); 
}

  getRankIconImages(rankNumber: number): string {
    switch (rankNumber) {
      case 1:
        return 'assets/Image/gold-medal.png'; 
      case 2:
        return 'assets/Image/2nd-place.png';
      case 3:
        return 'assets/Image/3rd-place.png';
      case 4:
        return 'assets/Image/number-4.png';
      case 5:
        return 'assets/Image/number-5.png';
      case 6:
        return 'assets/Image/number-6.png';
      case 7:
        return 'assets/Image/number-7.png';
      case 8:
        return 'assets/Image/number-8.png';
      case 9:
        return 'assets/Image/number-9.png';
      case 10:
        return 'assets/Image/number-10.png';
      default:
        return 'assets/Image/null.png';
    }
  }

  async loadData() {
    this.shareData.userData = await this.api.getUserbyId(this.id);
    localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
    console.log(this.shareData.userData);
  }

  navigateTop() {
    this.router.navigate(['/top10']);
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
  navigateTomain() {
    this.router.navigate(['/']);
  }

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  clearData() {
    this.shareData.userData = undefined;
  }
}
