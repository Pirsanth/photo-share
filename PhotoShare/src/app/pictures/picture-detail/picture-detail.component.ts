import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentsService } from "../../services/comments.service";
import { ActivatedRoute } from "@angular/router";
import { CommentsDocument, commentObjectWithLikedBoolean } from "../../customTypes";
import { AuthenticationService} from "../../services/authentication.service";
import { Subscription } from "rxjs";
import { FormControl, Validators } from "@angular/forms";


@Component({
  selector: 'app-picture-detail',
  templateUrl: './picture-detail.component.html',
  styleUrls: ['./picture-detail.component.css'],
  providers: [CommentsService]
})
export class PictureDetailComponent implements OnInit, OnDestroy {
  commentsArray: commentObjectWithLikedBoolean[];
  mainImageSrc: string;
  liked:boolean = true;
  postingNewComment:boolean = false;
  username:string;
  subscription: Subscription;
  commentControl = new FormControl("", Validators.required);
  avatarPrefix = "/avatars";
  pictureTitle: string;

  constructor(private ajax:CommentsService, private user:AuthenticationService, private route:ActivatedRoute ) { }

  ngOnInit() {
    this.username = this.user.currentUser;
    this.route.data.subscribe(x => {
      const {commentDoc} = x;
      this.pictureTitle = commentDoc._id.pictureTitle;
      this.commentsArray = commentDoc.comments;
      this.mainImageSrc = commentDoc.originalSrc;
    })
    this.subscription = this.ajax.commentsSubject$
      .subscribe( (commentDoc:CommentsDocument<commentObjectWithLikedBoolean>) => {
        this.commentsArray = commentDoc.comments;
        this.mainImageSrc = commentDoc.originalSrc;
      })

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  likeComment(commentId:string){
    this.ajax.likeComment(commentId).subscribe(x => console.log("Comment like was successful added"))
  }
  unlikeComment(commentId:string){
    this.ajax.removeLike(commentId).subscribe(x => console.log("Comment like was successful removed"))
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

    if(this.commentControl.valid){
      this.postingNewComment = true;
      this.ajax.addANewComment(text)
      .subscribe(x => {
        this.postingNewComment = false
        this.ajax.resetTimer();
      });
    }
    else{
      this.commentControl.markAsTouched();
    }

  }
  handleDelete(commentId:string){
    this.ajax.removeExistingComment(commentId)
    .subscribe( x => {
      console.log("Comment was successful removed on the server")
      this.ajax.resetTimer();
    })
  }
}
