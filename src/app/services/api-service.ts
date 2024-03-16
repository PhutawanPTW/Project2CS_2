import { Injectable, OnInit } from '@angular/core';
import { Constant } from '../config/constaint';
import { HttpClient } from '@angular/common/http';
import { count, lastValueFrom } from 'rxjs';
import {
  Register,
  Statistic,
  User,
  Vote,
  imageUpload,
  imageUser,
} from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url: string;

  constructor(private constant: Constant, private http: HttpClient) {
    this.url = this.constant.API_ENDPOINT;
  }

  public async getUser() {
    const response = await lastValueFrom(
      this.http.get<User[]>(`${this.url}/users`)
    );
    // console.log(response);
    return response;
  }
  public async getImage() {
    const response = await lastValueFrom(
      this.http.get<imageUser[]>(`${this.url}/images`)
    );
    return response;
  }

  public async gettodayrank() {
    const response = await lastValueFrom(
      this.http.get<imageUser[]>(`${this.url}/top/today`) // เปลี่ยน URL ตามต้องการ
    );
    // console.log(response);
    return response;
  }

  public async getyesterdayrank() {
    const response = await lastValueFrom(
      this.http.get<imageUser[]>(`${this.url}/top/yesterday`) // เปลี่ยน URL ตามต้องการ
    );
    // console.log(response);

    return response;
  }

  public async uploadImage(file: File, userID: string): Promise<imageUpload> {
    const formData = new FormData();
    formData.append('filename', file, file.name);
    formData.append('userID', userID);

    try {
      const response = await lastValueFrom(
        this.http.post<imageUpload>(`${this.url}/upload/${userID}`, formData)
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error uploading image', error);
      throw error;
    }
  }

  public async getUserbyId(userId: number) {
    if (userId) {
      const response = await lastValueFrom(
        this.http.get(`${this.url}/users/${userId}`)
      );
      return response as User;
    } else {
      return;
    }
  }

  public async getImagebyId(imageID: number) {
    const response = await lastValueFrom(
      this.http.get(`${this.url}/images/${imageID}`)
    );
    return response as imageUpload;
  }

  public async deleteImagebyId(imageID: number) {
    const response = await lastValueFrom(
      this.http.delete(`${this.url}/images/${imageID}`)
    );
    return response;
  }

  public async register(body: Register) {
    const requestBody = {
      username: body.username,
      password: body.password,
      email: body.email,
      type: 'user',
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
      elorating: body.elorating,
    };

    try {
      const response = await lastValueFrom(
        this.http.post<Vote>(`${this.url}/vote`, requestBody)
      );
      return response;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล', error);
      throw error;
    }
  }

  public updateScore(id: number, score: number) {
    let body = {
      count: score,
    };
    this.http.put(this.url + '/images/' + id, body).subscribe();
  }

  public async getStatistic(imageID: number, day: number) {
    try {
      const response = await lastValueFrom(
        this.http.get<Statistic[]>(`${this.url}/statistics/${imageID}/${day}`)
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  public async getStatisticbyId(image: number) {
    if (image) {
      const response = await lastValueFrom(
        this.http.get(`${this.url}/statistics/${image}`)
      );
      return response as Statistic;
    } else {
      return;
    }
  }
}
