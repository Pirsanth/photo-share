import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import {AjaxService} from "./ajax.service";

import { Observable } from "rxjs";

type likeOrDislike = 1 | -1;


@Injectable({
  providedIn: 'root'
})
export class LikesService {
  username: string;
  baseURL: string;

  constructor(private http: HttpClient, private ajax: AjaxService) {
    this.username = ajax.username;
    this.baseURL = ajax.baseURL;
  }

  addLikes(value: likeOrDislike, albumName: string, pictureTitle: string){
    const body = { username: this.username, likeOrDislike: value}
    return this.http.post(`${this.baseURL}/likes/${albumName}/${pictureTitle}`,body
      , {observe: "body", responseType: "json"})
    }
  removeLikes(value: likeOrDislike, albumName: string, pictureTitle: string){
    const transmittedValue:string = value + "";
    return this.http.delete(`${this.baseURL}/likes/${albumName}/${pictureTitle}`,
            {observe: "body", responseType: "json", params: {username: this.username, oldValue: transmittedValue}})
  }
  editLikes(oldValue: likeOrDislike, newValue: likeOrDislike, albumName: string, pictureTitle: string){
    const body = { username: this.username, oldValue, newValue}
    return this.http.put(`${this.baseURL}/likes/${albumName}/${pictureTitle}`,body,
          {observe: "body", responseType: "json"})
    }
}
