import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Constant {
  public readonly API_ENDPOINT: string = 'http://localhost:3000';
}
