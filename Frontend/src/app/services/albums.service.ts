import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient, HttpProgressEvent, HttpEventType} from "@angular/common/http"
import { pluck, map, tap, last, catchError, takeUntil} from "rxjs/operators";
import {throwError, Observable, Subject, BehaviorSubject} from "rxjs";
import {Album, Picture} from "../customTypes";
import { environment } from "../../environments/environment";
import { SpinnerService } from "./spinner.service";

type albumsResponse = {error: string, data: Album[]};

@Injectable({
  providedIn: 'root'
})
export class AlbumsService implements OnDestroy {
  public baseURL: string = environment.apiUrl;
  public uploadingFiles: boolean = false;
  private cancelRequest:Subject<boolean> = new Subject();
  private uploadProgress:BehaviorSubject<string> = new BehaviorSubject("0");
  percentageUploaded$ = this.uploadProgress.asObservable();
  constructor(private http: HttpClient, private spinner:SpinnerService) {}


  sendForm(formData: FormData){
    formData.delete("useExistingAlbum");
    formData.delete("customPictureTitle");
    let postUrl = `${this.baseURL}/albums/`;

    this.uploadingFiles = true;
    this.uploadProgress.next("0");
    return this.http.post(postUrl, formData,
            {observe: "events", responseType: "json", reportProgress: true}).pipe(
              tap((event) => {

                if(event.type === HttpEventType.UploadProgress){
                  const percentageComplete = ((event.loaded/event.total) *100).toFixed(0) + "%";
                  this.uploadProgress.next(percentageComplete);
                }

              }),
              last(),
              tap(()=>{
                this.uploadingFiles = false;
              }),
              catchError(err => {
                this.uploadingFiles = false;
                return throwError(err);
              }),
              takeUntil(this.cancelRequest)
            )
  }

  getAllAlbums():Observable<Album[]>{
    const getUrl = `${this.baseURL}/albums/`;
    return this.http.get<Album[]>(getUrl,{observe: "body", responseType: "json"})
            .pipe(pluck("data"))
        //    .pipe(map((arr: Album[]) => arr.map((album:Album) => this.addBaseUrlToImageSrc(album) )))
  }

  getAnAlbum(albumName: string):Observable<Album>{
    const getUrl = `${this.baseURL}/albums/${albumName}`;
    return this.http.get<Album>(getUrl,{observe: "body", responseType: "json"})
            .pipe(pluck("data"))
        //    .pipe(map((album: Album) => this.addBaseUrlToImageSrc(album)))
  }
  getAlbumsList():Observable<Array<string>>{
    return this.http.get(`${this.baseURL}/albums/albumsList/`)
           .pipe( pluck("data") )
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
  cancelUpload(){
    this.cancelRequest.next(true);
    this.uploadingFiles = false;
    this.uploadProgress.next("0");
  }
  ngOnDestroy(){
    this.cancelRequest.complete();
  }
}
