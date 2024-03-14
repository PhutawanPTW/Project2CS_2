import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Constant {
  public readonly API_ENDPOINT: string = 'https://project2cs-back.onrender.com';
}
// async shuffleImages() {
//   const [userData1, userData2] = await Promise.all([
//     this.api.getUserbyId(this.leftImage.userID),
//     this.api.getUserbyId(this.rightImage.userID),
//   ]);

//   this.userData1 = userData1;
//   this.userData2 = userData2;
// }  userData1: User | undefined;
// userData2: User | undefined;