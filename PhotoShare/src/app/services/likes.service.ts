import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import {AlbumsService} from "./albums.service";

import { Observable } from "rxjs";

type likeOrDislike = 1 | -1;


@Injectable({
  providedIn: 'root'
})
export class LikesService {
  username: string;
  baseURL: string;

  constructor(private http: HttpClient, private ajax: AlbumsService) {
    this.baseURL = ajax.baseURL;
  }

  addLikes(value: likeOrDislike, albumName: string, pictureTitle: string){
    const body = { likeOrDislike: value }
    return this.http.post(`${this.baseURL}/albums/likes/${albumName}/${pictureTitle}`,body,
            {observe: "body", responseType: "json"})
    }
  removeLikes(value: likeOrDislike, albumName: string, pictureTitle: string){
    const transmittedValue:string = value + "";
    return this.http.delete(`${this.baseURL}/albums/likes/${albumName}/${pictureTitle}`,
            {observe: "body", responseType: "json", params: { oldValue: transmittedValue }})
  }
  editLikes(oldValue: likeOrDislike, newValue: likeOrDislike, albumName: string, pictureTitle: string){
    const body = { oldValue, newValue }
    return this.http.put(`${this.baseURL}/albums/likes/${albumName}/${pictureTitle}`,body,
          {observe: "body", responseType: "json"})
    }
}
