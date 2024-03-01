import { Injectable, OnInit } from '@angular/core';
import { Constant } from '../config/constaint';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Register, User } from '../model/model';


@Injectable({
  providedIn: 'root'
})
export class ApiService{

  private url :string;
  users : User[] =[];
  constructor(private constant : Constant , private http : HttpClient)  {
    this.url = this.constant.API_ENDPOINT;
    console.log(this.url);
  }
 

  public async getUser(){
    const response = await lastValueFrom(
      this.http.get<User[]>(`${this.url}/users`));
      // console.log(response);
    return response
  }

  public async getUserbyId(userId : number){
    const response = await lastValueFrom(
      this.http.get<User>(`${this.url}/users/${userId}`));
      // console.log(response);
    return response
  }

  public async register(body : Register) {
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

  

  
}

  
