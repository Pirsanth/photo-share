import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AjaxService } from "./ajax.service";
import { Observable } from "rxjs";
import { tap, pluck } from "rxjs/operators";

type userData = {username: string, refreshToken: string, accessToken:string};


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser:string = null;
  set accessToken(token:string){
    localStorage.setItem("accessToken", token);
  }
  get accessToken(){
    return localStorage.getItem("accessToken");
  }

  set refreshToken(token:string){
    localStorage.setItem("refreshToken", token);
  }
  get refreshToken(){
    return localStorage.getItem("refreshToken");
  }

  constructor(private http:HttpClient, private ajax:AjaxService) { }

  signUp(formData: FormData){
    const postUrl = this.ajax.baseURL + "/auth/signUp";

    return this.http.post(postUrl, formData, {observe: "body", responseType: "json"})
          .pipe( pluck("data") )
          .pipe(tap( (x:userData) => {
            this.currentUser = x.username;
            this.accessToken = x.accessToken
            this.refreshToken = x.refreshToken
            }))
  }
  signIn(formValues:JSON){
    const postUrl = this.ajax.baseURL + "/auth/signIn";
    return this.http.post(postUrl, formValues, {observe: "body", responseType: "json"})
          .pipe( pluck("data") )
          .pipe(tap( (x:userData) => {
            this.currentUser = x.username;
            this.accessToken = x.accessToken
            this.refreshToken = x.refreshToken
            }));
  }
  logout(){
    const postUrl = this.ajax.baseURL + "/auth/logout";
    return this.http.post(postUrl, {refreshToken: this.refreshToken},{responseType:"json", observe: "body"})
           .pipe( tap(x => this.clearUserData() ) );
  }
  clearUserData(){
    localStorage.clear();
    this.currentUser = null;
  }
}
