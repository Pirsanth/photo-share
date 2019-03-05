import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AjaxService } from "./ajax.service";
import { CommentsDocument, commentObject, commentObjectWithLikedBoolean } from "../customTypes";
import { Observable, Subject, timer, Subscription } from "rxjs";
import { pluck, map, switchMap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CommentsService implements OnDestroy {
  albumName:string;
  pictureTitle:string;
  commentsSubject$: Subject<CommentsDocument<commentObjectWithLikedBoolean>> = new Subject();
  subscription:Subscription;

  constructor(private http:HttpClient, private ajax:AjaxService, private route:ActivatedRoute, private auth:AuthenticationService) {
      this.route.paramMap.subscribe( paramMap => {
        this.albumName = paramMap.get("albumName");
        this.pictureTitle = paramMap.get("pictureTitle");
      })
      this.subscription = this.keepFetchingComments().subscribe(this.commentsSubject$);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  resetTimer(){
    this.subscription.unsubscribe();
    this.subscription = this.keepFetchingComments().subscribe(this.commentsSubject$);
  }
  keepFetchingComments(){
    return timer(0, 5000)
           .pipe( switchMap(() => this.getCommentDocument() ) )
  }
  getCommentDocument():Observable<CommentsDocument<commentObjectWithLikedBoolean>>{
      const getURL = this.ajax.baseURL + `/comments/${this.albumName}/${this.pictureTitle}`;
      return  this.http.get<CommentsDocument<commentObject>>(getURL, {observe: "body", responseType: "json"})
              .pipe( pluck("data") )
        /*      .pipe( map((x:CommentsDocument<commentObject>) => {
                  x.originalSrc = `${this.ajax.baseURL}/${x.originalSrc}`
                  return x;
                }))
       */
              .pipe( map( (x:CommentsDocument<commentObject>) => this.modifyCommentDocumentforView(x) ));
  }
  likeComment(commentId:string){
    const postUrl = this.ajax.baseURL + `/comments/likes/${this.albumName}/${this.pictureTitle}`;
    const body = {username: this.auth.currentUser, commentId};
    return this.http.post(postUrl, body, {observe: "body", responseType: "json"})
  }
  removeLike(commentId:string){
    const deletetUrl = this.ajax.baseURL + `/comments/likes/${this.albumName}/${this.pictureTitle}`;
    const body = {username: this.auth.currentUser, commentId};
    return this.http.request("DELETE", deletetUrl,{body, observe: "body", responseType: "json"});
  }
  //body: {text: string, username: string}
  addANewComment(text: string){
    const postUrl = this.ajax.baseURL + `/comments/${this.albumName}/${this.pictureTitle}`;
    const username = this.auth.currentUser;
    const body = {text, username};
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
