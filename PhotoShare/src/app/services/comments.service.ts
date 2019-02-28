import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AjaxService } from "./ajax.service";
import { CommentsDocument, commentObject, commentObjectWithLikedBoolean } from "../customTypes";
import { Observable } from "rxjs";
import { pluck, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http:HttpClient, private ajax:AjaxService) { }

  getCommentDocument(albumName:string, pictureTitle:string):Observable<CommentsDocument<commentObjectWithLikedBoolean>>{
      const getURL = this.ajax.baseURL + `/comments/${albumName}/${pictureTitle}`;
      return  this.http.get<CommentsDocument<commentObject>>(getURL, {observe: "body", responseType: "json"})
              .pipe( pluck("data") )
              .pipe( map((x:CommentsDocument<commentObject>) => {
                x.originalSrc = `${this.ajax.baseURL}/${x.originalSrc}`
                return x;
              }))
              .pipe( map( (x:CommentsDocument<commentObject>) => this.modifyCommentDocumentforView(x) ));
  }
  likeComment(albumName:string, pictureTitle:string, commentId:string){
    const postUrl = this.ajax.baseURL + `/comments/likes/${albumName}/${pictureTitle}`;
    const body = {username: this.ajax.username, commentId};
    return this.http.post(postUrl, body, {observe: "body", responseType: "json"})
  }
  removeLike(albumName:string, pictureTitle:string, commentId:string){
    const deletetUrl = this.ajax.baseURL + `/comments/likes/${albumName}/${pictureTitle}`;
    const body = {username: this.ajax.username, commentId};
    return this.http.request("DELETE", deletetUrl,{body, observe: "body", responseType: "json"});
  }
  //body: {text: string, username: string}
  addANewComment(albumName:string, pictureTitle:string, text: string){
    const postUrl = this.ajax.baseURL + `/comments/${albumName}/${pictureTitle}`;
    const username = this.ajax.username;
    const body = {text, username};
    return this.http.post(postUrl, body, {observe: "body", responseType: "json"})
  }
  private addLikedAttributeToCommentObject(commentObject: commentObject):commentObjectWithLikedBoolean{
    const username = this.ajax.username;
    const liked:boolean = commentObject.voters.some((voter) => voter === username);
    return {...commentObject, liked};
  }
  private modifyCommentDocumentforView(commentDocument:CommentsDocument<commentObject>):CommentsDocument<commentObjectWithLikedBoolean> {
    var comments = commentDocument.comments.map( (comment:commentObject) => this.addLikedAttributeToCommentObject(comment) )
    return {...commentDocument, comments};
  }

}
