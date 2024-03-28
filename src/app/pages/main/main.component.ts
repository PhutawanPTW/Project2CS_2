import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { User, imageUpload, imageUser } from '../../model/model';
import { ApiService } from '../../services/api-service';
import { ShareService } from '../../services/share.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import $ from 'jquery';

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
    private router: Router,
    private dialog: MatDialog
  ) {}

  id: any;
  leftImage: any;
  rightImage: any;
  K_FACTOR: number = 32;
  userData1: User | undefined;
  userData2: User | undefined;
  public images: imageUser[] = [];
  canVote = true;
  isCD = true;
  httpError: boolean = false;
  leftImageError: boolean = false;
  user: User[] = [];

  async ngOnInit() {
    this.id = localStorage.getItem('userID');
    this.checkData();
    this.images = await this.api.getImage();

    this.loadImages();

    $('.toggle').click(function (e: JQuery.Event) {
      e.preventDefault();
      $(this).toggleClass('toggle-on');
    });
    if (this.shareData.userData?.type == 'owner') {
      this.router.navigate(['/login']);
    }
    console.log(this.shareData.userData);
  }

  checkData() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        this.shareData.userData = userData;
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
        this.loadData();
      }
    } else {
      this.loadData();
    }
  }
  async loadData() {
    if (!this.id) {
      return;
    }
    if (!localStorage.getItem('userData')) {
      this.shareData.userData = await this.api.getUserbyId(this.id);
      localStorage.setItem('userData', JSON.stringify(this.shareData.userData));
      // console.log(this.shareData.userData);
    }
  }

  async loadImages() {
    if (this.images && this.images.length >= 2) {
      this.canVote = true;
      const randomIndex1 = Math.floor(Math.random() * this.images.length);
      let randomIndex2 = Math.floor(Math.random() * this.images.length);

      while (
        randomIndex2 === randomIndex1 ||
        this.images[randomIndex2].imageID === this.leftImage?.imageID ||
        this.images[randomIndex2].imageID === this.rightImage?.imageID
      ) {
        randomIndex2 = Math.floor(Math.random() * this.images.length);
      }

      this.leftImage = this.images[randomIndex1];
      this.rightImage = this.images[randomIndex2];
    } else {
      this.canVote = false;
    }

    const [userData1, userData2] = await Promise.all([
      this.api.getUserbyId(this.leftImage.userID),
      this.api.getUserbyId(this.rightImage.userID),
    ]);

    this.userData1 = userData1;
    this.userData2 = userData2;
  }

  async reshuffleImages(winner: imageUser, loser: imageUser) {
    const {
      plus,
      minus,
      winnerOldRating,
      winnerNewRating,
      loserOldRating,
      loserNewRating,
      winnerExpectedScore,
      loserExpectedScore,
    } = await this.calrating(winner, loser);

    console.log(`Winner's old rating: ${winnerOldRating}`);
    console.log(`Winner's new rating: ${winnerNewRating}`);
    console.log(`Winner's increased by: ${plus}`);
    console.log(`Winner's expected score: ${winnerExpectedScore}`);

    console.log(`Loser's old rating: ${loserOldRating}`);
    console.log(`Loser's new rating: ${loserNewRating}`);
    console.log(`Loser's decreased by: ${minus}`);
    console.log(`Loser's expected score: ${loserExpectedScore}`);

    if (this.isCD) {
      this.isCD = false;
      if (!$('.toggle').hasClass('toggle-on')) {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '900px',
          data: {
            winner: winner,
            loser: loser,
            winnerOldScore: winner.count,
            loserOldScore: loser.count,
            winnerExpectedScore: this.calculateExpectedScore(
              winner.count,
              loser.count,
              winner.imageID.toString(),
              loser.imageID.toString()
            ),
            loserExpectedScore: this.calculateExpectedScore(
              loser.count,
              winner.count,
              loser.imageID.toString(),
              winner.imageID.toString()
            ),
            plus: plus,
            minus: minus,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.chooseRandomImages(winner, loser);
          this.loadImages();
          if (this.canVote) {
            this.calrating(winner, loser);
          }
          setTimeout(() => {
            this.isCD = true;
          }, 1000);
        });
      } else {
        this.chooseRandomImages(winner, loser);
        this.loadImages();
        if (this.canVote) {
          this.calrating(winner, loser);
        }
        setTimeout(() => {
          this.isCD = true;
        }, 1000);
      }
    }
  }

  async calrating(winner: imageUser, loser: imageUser) {
    const winnerEloRating = winner.count;
    const loserEloRating = loser.count;

    const winnerExpectedScore = this.calculateExpectedScore(
      winnerEloRating,
      loserEloRating,
      winner.imageID.toString(), // แปลงเป็น string
      loser.imageID.toString() // แปลงเป็น string
    );
    const loserExpectedScore = this.calculateExpectedScore(
      loserEloRating,
      winnerEloRating,
      loser.imageID.toString(), // แปลงเป็น string
      winner.imageID.toString() // แปลงเป็น string
    );

    const plus = Math.round(this.K_FACTOR * (1 - winnerExpectedScore));
    const minus = Math.round(this.K_FACTOR * (0 - loserExpectedScore));

    const winnerNewRating = winnerEloRating + plus;
    const loserNewRating = loserEloRating + minus;

    // ปัดคะแนนใหม่เป็นจำนวนเต็ม
    winner.count = Math.round(winnerNewRating);
    loser.count = Math.round(loserNewRating);

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

    await this.api.updateScore(winner.imageID, winner.count);
    await this.api.updateScore(loser.imageID, loser.count);
    await this.api.vote(winnerBody);
    await this.api.vote(loserBody);

    return {
      plus,
      minus,
      winnerOldRating: winnerEloRating,
      winnerNewRating: winnerNewRating,
      loserOldRating: loserEloRating,
      loserNewRating: loserNewRating,
      winnerExpectedScore,
      loserExpectedScore,
    };
  }

  private calculateExpectedScore(
    playerRating: number,
    opponentRating: number,
    playerImageID: string,
    opponentImageID: string
  ): number {
    const exponent = (opponentRating - playerRating) / 400;
    const expectedScore = 1 / (1 + Math.pow(10, exponent));
    return expectedScore;
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

  navigateToViewProfile(userID: number) {
    const isLoggedIn = this.shareData.userData !== undefined; // Check if user is logged in
    const loggedInUserID = this.shareData.userData
      ? this.shareData.userData.userID
      : null; // Get logged in user's ID
    if (isLoggedIn && loggedInUserID === userID) {
      // If logged in and the clicked profile is the user's own profile
      this.router.navigate(['/profile']); // Navigate to the profile page
    } else if (isLoggedIn) {
      // If logged in but trying to view another user's profile
      this.router.navigate(['/ViewProfile', userID]); // Navigate to the view profile page
    } else {
      // If not logged in
      this.alertMessage();
    }
  }

  alertMessage() {
    alert('You need to log in first!');
    localStorage.clear();
    this.router.navigate(['/login']);
    this.clearData();
  }

  navigateTop() {
    this.router.navigate(['/top10']);
  }

  clearData() {
    this.shareData.userData = undefined;
  }

  countdownDuration: number = 10; // Set the countdown duration in seconds
  countdownInterval: any;

  chooseRandomImages(select: imageUser, select2: imageUser) {
    const foundItemIndex = this.images.findIndex(
      (item) => item.imageID === select.imageID
    );

    const foundItemIndex2 = this.images.findIndex(
      (item) => item.imageID === select2.imageID
    );

    if (foundItemIndex !== -1 && foundItemIndex2 !== -1) {
      const chosenImage = this.images.splice(foundItemIndex, 1)[0];
      const chosenImage2 = this.images.splice(foundItemIndex2, 1)[0];
      // console.log('Removed images after vote:', chosenImage, chosenImage2);
      // console.log('all', this.images);

      if (this.images.length === 2) {
        this.canVote = false; // Disable further voting when only two images are left

        // Start the countdown
        this.countdownInterval = setInterval(() => {
          this.countdownDuration--;

          if (this.countdownDuration === 0) {
            clearInterval(this.countdownInterval);
            this.images.push(chosenImage, chosenImage2);
            console.log('Array after addition:', this.images);
            this.canVote = true;
            this.countdownDuration = 10; // Reset the countdown duration
          }
        }, 10);
      }
    } else {
      console.log(
        `Item with imageID ${select.imageID} or ${select2.imageID} not found in the array.`
      );
    }
  }
}