import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AlbumsService } from "./albums.service";
import { CommentsDocument, commentObject, commentObjectWithLikedBoolean } from "../customTypes";
import { Observable, Subject, timer, merge } from "rxjs";
import { pluck, map, switchMap, repeatWhen, delay } from "rxjs/operators";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CommentsService implements OnDestroy {
  albumName:string;
  pictureTitle:string;
  private refreshComments$: Subject<boolean> = new Subject();

  constructor(private http:HttpClient, private ajax:AlbumsService, private auth:AuthenticationService) {}

  ngOnDestroy(){
   this.refreshComments$.complete();
  }
  resetTimer(){
    this.refreshComments$.next(true);
  }

  get commentsArrayStream$(){
    return this.commentsDocumentStream(5000)
           .pipe( pluck("comments") ) as Observable<Array<commentObjectWithLikedBoolean>>;
  }

  private commentsDocumentStream(interval:number): Observable<CommentsDocument<commentObjectWithLikedBoolean>> {
    //using switch map because we do not necessarily need all observables to complete, we simply need
    //the LATEST comment document
    return merge( this.refreshComments$, timer(interval) )
    .pipe( switchMap( () =>  this.keepFetchingCommentsEvery(interval) ))
  }
  keepFetchingCommentsEvery(interval:number){
    return this.getCommentDocument().pipe(
      repeatWhen( (completedObs) => completedObs.pipe( delay(interval) ) )
    )
  }
  getCommentDocument():Observable<CommentsDocument<commentObjectWithLikedBoolean>>{
      const getURL = this.ajax.baseURL + `/comments/${this.albumName}/${this.pictureTitle}`;
      return  this.http.get<CommentsDocument<commentObject>>(getURL, {observe: "body", responseType: "json"})
              .pipe( pluck("data") )
              .pipe( map( (x:CommentsDocument<commentObject>) => this.modifyCommentDocumentforView(x) ));
  }
  likeComment(commentId:string){
    const postUrl = this.ajax.baseURL + `/comments/likes/${this.albumName}/${this.pictureTitle}`;
    const body = {commentId};
    return this.http.post(postUrl, body, {observe: "body", responseType: "json"})
  }
  removeLike(commentId:string){
    const deletetUrl = this.ajax.baseURL + `/comments/likes/${this.albumName}/${this.pictureTitle}`;
    const body = {commentId};
    return this.http.request("DELETE", deletetUrl,{body, observe: "body", responseType: "json"});
  }

  addANewComment(text: string){
    const postUrl = this.ajax.baseURL + `/comments/${this.albumName}/${this.pictureTitle}`;
    const body = {text};
    return this.http.post(postUrl, body, {observe: "body", responseType: "json"})
  }
  removeExistingComment(commentId:string ){
    const deletetUrl = this.ajax.baseURL + `/comments/${this.albumName}/${this.pictureTitle}`;
    const body = {commentId};
    return this.http.request("DELETE", deletetUrl,{body, observe: "body", responseType: "json"});
  }
  private addLikedAttributeToCommentObject(commentObject: commentObject):commentObjectWithLikedBoolean{
    const username = this.auth.currentUser;
    const liked:boolean = commentObject.voters.some((voter) => voter === username);
    return {...commentObject, liked};
  }
  private modifyCommentDocumentforView(commentDocument:CommentsDocument<commentObject>):CommentsDocument<commentObjectWithLikedBoolean> {
    var comments = commentDocument.comments.map( (comment:commentObject) => this.addLikedAttributeToCommentObject(comment) )
    return {...commentDocument, comments};
  }

}
