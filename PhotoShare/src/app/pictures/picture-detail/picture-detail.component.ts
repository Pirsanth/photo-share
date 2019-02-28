import { Component, OnInit } from '@angular/core';
import { CommentsService } from "../../services/comments.service";
import { ActivatedRoute } from "@angular/router";
import { CommentsDocument, commentObjectWithLikedBoolean } from "../../customTypes";
import { AjaxService } from "../../services/ajax.service";

@Component({
  selector: 'app-picture-detail',
  templateUrl: './picture-detail.component.html',
  styleUrls: ['./picture-detail.component.css']
})
export class PictureDetailComponent implements OnInit {
  commentsArray: commentObjectWithLikedBoolean[];
  mainImageSrc: string;
  albumName: string;
  pictureTitle: string;
  liked:boolean = true;
  postingNewComment:boolean = false;
  username:string;

  constructor(private ajax:CommentsService, private route: ActivatedRoute, private user:AjaxService) { }

  ngOnInit() {
    this.username = this.user.username;

    this.route.paramMap.subscribe( paramMap => {
      this.albumName = paramMap.get("albumName");
      this.pictureTitle = paramMap.get("pictureTitle");

      this.ajax.getCommentDocument(this.albumName, this.pictureTitle).subscribe( (commentDoc:CommentsDocument<commentObjectWithLikedBoolean>) => {
        console.log(commentDoc)
        this.commentsArray = commentDoc.comments;
        this.mainImageSrc = commentDoc.originalSrc;

      })
    })
  }
  likeComment(commentId:string){
    this.ajax.likeComment(this.albumName, this.pictureTitle, commentId).subscribe(x => console.log("Comment like was successful added"))
  }
  unlikeComment(commentId:string){
    this.ajax.removeLike(this.albumName, this.pictureTitle, commentId).subscribe(x => console.log("Comment like was successful removed"))
  }
  handleLikeButton(comment: commentObjectWithLikedBoolean){
      if(comment.liked){
        comment.likes--;
        comment.liked = false;
        this.unlikeComment(comment.commentId);
      }
      else{
        comment.likes++;
        comment.liked = true;
        this.likeComment(comment.commentId);
      }
  }
  handlePostComment(text:string){
    this.postingNewComment = true;
    this.ajax.addANewComment(this.albumName, this.pictureTitle, text)
    .subscribe(x => this.postingNewComment = false);
  }
  print(){
    console.log(this.commentsArray)
  }
}
