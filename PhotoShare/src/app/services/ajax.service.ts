import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import {catchError, pluck, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {Album, Picture} from "../customTypes";

type albumsResponse = {error: string, data: Album[]};

@Injectable({
  providedIn: 'root'
})

export class AjaxService {
  public baseURL: string = "http://localhost:3000";
  constructor(private http: HttpClient) {}

  sendForm(formData: FormData){
    const albumName = this.getAlbumName(formData)
    const postUrl = `${this.baseURL}/albums/${albumName}`;
    return this.http.post(postUrl, formData,
            {observe: "body", responseType: "json"})
            .pipe(catchError((error) => {
              console.log(error);
              return throwError("An error occured")
            }))
  }
  getAllAlbums(){
    const getUrl = `${this.baseURL}/albums/`;
    return this.http.get<Album[]>(getUrl,{observe: "body", responseType: "json"})
            .pipe(pluck("data"))
            .pipe(map((arr: Album[]) => arr.map((album:Album) => this.addBaseUrlToImageSrc(album) )))

            .pipe(catchError((error) => {
              console.log(error);
              return throwError("An error occured")
            }))
  }
  private getAlbumName(formData: FormData){
     return formData.get("albumName");
  }
  private addBaseUrlToImageSrc(album: Album):Album {
     album.picsSrc = album.picsSrc.map((picture: Picture) => {
       picture.thumbnailSrc = `${this.baseURL}/${picture.thumbnailSrc}`;
       picture.originalSrc = `${this.baseURL}/${picture.originalSrc}`;
       return picture;
     });
     return album;
  }
}
