import { Injectable, OnInit } from '@angular/core';
import { Constant } from '../config/constaint';
import { HttpClient } from '@angular/common/http';
import { count, lastValueFrom } from 'rxjs';
import { Register, User, Vote, imageUpload } from '../model/model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string;
  users: User[] = [];
  userData: User | undefined;

  constructor(private constant: Constant, private http: HttpClient) {
    this.url = this.constant.API_ENDPOINT;

  }


  public async getUser() {
    const response = await lastValueFrom(
      this.http.get<User[]>(`${this.url}/users`));
    // console.log(response);
    return response
  }
  public async getImage() {
    const response = await lastValueFrom(
      this.http.get<imageUpload[]>(`${this.url}/images`));
    return response
  }

  public async getUserbyId(userId: number) {
    const response = await lastValueFrom(
      this.http.get(`${this.url}/users/${userId}`));
    return response as User
  }


  public async register(body: Register) {
    const requestBody = {
      username: body.username,
      password: body.password,
      email: body.email,
      type: "user",
    };

    try {
      const response = await lastValueFrom(
        this.http.post<User[]>(`${this.url}/users`, requestBody)
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล', error);
      throw error;
    }
  }

  public async vote(body: Vote) {
    const requestBody = {
      userID: body.userID,
      imageID: body.imageID,
      elorating: body.elorating
    }

    try {
      const response = await lastValueFrom(
        this.http.post<Vote>(`${this.url}/vote`, requestBody)
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล', error);
      throw error;
    }
  }

  //ยังไม่เสร็จ
  
  public updateScore(id: number, score: number) {
    let body = {
      count : score
    }
    this.http.put(this.url + "/images/" + id , body).subscribe();
  }

}


