import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AlbumsService } from "./albums.service";
import { BehaviorSubject, of, throwError } from "rxjs";
import { tap, pluck, map, catchError } from "rxjs/operators";


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
          .pipe( pluck("data") );
  }
  signIn(formValues:JSON){
    const postUrl = this.ajax.baseURL + "/auth/signIn";
    return this.http.post(postUrl, formValues, {observe: "body", responseType: "json"})
          .pipe( pluck("data") )
  }

  setUserData(data:userData){
    this.currentUser = data.username;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
  logout(){
    const postUrl = this.ajax.baseURL + "/auth/logout";
    return this.http.post(postUrl, {refreshToken: this.refreshToken},{responseType:"json", observe: "body"})
           .pipe(
               catchError((err:HttpErrorResponse) => {
                  if(err.status === 401 && err.error && err.error.error === "jwt expired"){
                    return of(true);
                  }
                  else{
                    return throwError(err);
                  }
              }),
              tap(x => {
                this.clearUserData()
              }),
          );
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
  attemptRefreshToken(){
    const postUrl = this.ajax.baseURL + "/auth/refresh";
    const refreshToken = this.refreshToken;
    return this.http.post(postUrl, {refreshToken}, {observe: "body", responseType: "json"})
           .pipe( map((x) =>{
              this.accessToken = x["data"]
              return x["data"]
           }));
  }
  isUsernameAvailable(requestedUsername: string){
    const postUrl = this.ajax.baseURL + "/auth/isUsernameAvailable";
    const requestBody = {requestedUsername};
    return this.http.post(postUrl, requestBody, {responseType: "json", observe: "body"})
           .pipe(
              pluck("data")
           )
  }
}
