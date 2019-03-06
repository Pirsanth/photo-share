import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AlbumsService } from "./albums.service";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { tap, pluck } from "rxjs/operators";


type userData = {username: string, refreshToken: string, accessToken:string};


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  username$ = new BehaviorSubject<string>(null);
  private _currentUser:string;

  set currentUser(name:string){
    this.username$.next(name);
    this._currentUser = name;

    //name can be set to null in which case we delete the localStorage entry
    if(name){
      localStorage.setItem("username", name);
    }
    else{
      localStorage.removeItem("username");
    }
  }
  get currentUser(){
    return this._currentUser;
  }
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

  constructor(private http:HttpClient, private ajax:AlbumsService) {
    this.checkSavedState();
  }

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
  checkSavedState(){
    const user = localStorage.getItem("username");
    if(user){
      this.currentUser = user;
    }
  }
}
