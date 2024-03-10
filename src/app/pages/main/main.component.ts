import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User, imageUpload } from '../../model/model';
import { ApiService } from '../../services/api-service';
import { ShareService } from '../../services/share.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', './main.component loading.scss'],
})
export class MainComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    protected shareData: ShareService,
    protected api: ApiService,
    private router: Router
  ) {}

  id: any;
  leftImage: any;
  rightImage: any;
  K_FACTOR: number = 32;
  userData1: User | undefined;
  userData2: User | undefined;
  public images: imageUpload[] = [];
  canVote = true;
  isCD = true;
  httpError: boolean = false;
  leftImageError: boolean = false;

  async ngOnInit() {
    this.clearData();
    this.id = localStorage.getItem('userID');
    this.loadData();
    this.images = await this.api.getImage();
    this.loadImages();
    this.shuffleImages;
  }
  async loadData() {
    if (!this.id) {
      return;
    }
    this.shareData.userData = await this.api.getUserbyId(this.id);
    localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
    console.log(this.shareData.userData);
  }

  async loadImages() {
    const images = await this.api.getImage();

    if (this.images && this.images.length >= 2) {
      this.canVote = true;
      const randomIndex1 = Math.floor(Math.random() * this.images.length);
      let randomIndex2 = Math.floor(Math.random() * this.images.length);

      while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * this.images.length);
      }

      this.leftImage = this.images[randomIndex1];
      this.rightImage = this.images[randomIndex2];
      this.shuffleImages(images);//api
    } else {
      this.canVote = false;
      // Handle this case based on your requirements
    }
  }

  async shuffleImages(images: any[]) {
    const [userData1, userData2] = await Promise.all([
      this.api.getUserbyId(this.leftImage.userID),
      this.api.getUserbyId(this.rightImage.userID),
    ]);

    this.userData1 = userData1;
    this.userData2 = userData2;
  }

  reshuffleImages(winner: imageUpload, loser: imageUpload) {
    console.error(winner);
    if (this.isCD) {
      this.isCD = false;
      this.chooseRandomImages(winner);
      this.loadImages();
      if (this.canVote) {
        this.calrating(winner, loser);
      }

      setTimeout(() => {
        this.isCD = true;
      }, 1000);
    }
  }

  async calrating(winner: imageUpload, loser: imageUpload) {
    // เปลี่ยน count เป็น eloRating สำหรับความชัดเจน
    const winnerEloRating = winner.count;
    const loserEloRating = loser.count;

    const winnerExpectedScore = this.calculateExpectedScore(
      winnerEloRating,
      loserEloRating
    );
    const loserExpectedScore = this.calculateExpectedScore(
      loserEloRating,
      winnerEloRating
    );
    const plus = Math.round(this.K_FACTOR * (1 - winnerExpectedScore));
    const minus = Math.round(this.K_FACTOR * (0 - loserExpectedScore));
    const winnerNewRating = winnerEloRating + plus;
    const loserNewRating = loserEloRating + minus;

    // ปัดคะแนนใหม่เป็นจำนวนเต็ม
    winner.count = Math.round(winnerNewRating);
    loser.count = Math.round(loserNewRating);

    console.log(
      'Winner is ' + winner.imageID + ' with new Elo rating: ' + winner.count
    );
    console.log(
      'Loser is ' + loser.imageID + ' with new Elo rating: ' + loser.count
    );

    const winnerBody = {
      userID: winner.userID,
      imageID: winner.imageID,
      elorating: plus,
    };
    const loserBody = {
      userID: loser.userID,
      imageID: loser.imageID,
      elorating: minus,
    };


    await this.api.vote(winnerBody);
    await this.api.vote(loserBody);
    await this.api.updateScore(winner.imageID, winner.count);
    await this.api.updateScore(loser.imageID, loser.count);
  }

  private calculateExpectedScore(
    playerRating: number,
    opponentRating: number
  ): number {
    const exponent = (opponentRating - playerRating) / 400;
    return 1 / (1 + Math.pow(10, exponent));
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

  navigateProfile() {
    this.router.navigate(['/profile']);
  }

  navigateTop() {
    this.router.navigate(['/top10']);
  }

  clearData() {
    this.shareData.userData = undefined;
  }

  chooseRandomImages(select: imageUpload) {
    const foundItemIndex = this.images.findIndex(
      (item) => item.imageID === select.imageID
    );

    if (foundItemIndex !== -1) {
      const chosenImage = this.images.splice(foundItemIndex, 1)[0];
      console.log(`Removed item with imageID: ${select.imageID}`);
      console.log('Array after removal:', this.images);

      setTimeout(() => {
        this.images.push(chosenImage);
        console.log(`Item added back to array: ${chosenImage}`);
        console.log('Array after addition:', this.images);
        if (this.images.length >= 2) {
          this.canVote = true;
        }
      }, 100000);
    } else {
      console.log(
        `Item with imageID ${select.imageID} not found in the array.`
      );
    }
  }
}
