import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentsService } from "../../services/comments.service";
import { ActivatedRoute } from "@angular/router";
import { PictureDetailModel, commentObjectWithLikedBoolean } from "../../customTypes";
import { AuthenticationService} from "../../services/authentication.service";
import { Subject } from "rxjs";
import { distinctUntilChanged, switchMap, takeUntil } from "rxjs/operators";
import { FormControl, Validators } from "@angular/forms";


@Component({
  selector: 'app-picture-detail',
  templateUrl: './picture-detail.component.html',
  styleUrls: ['./picture-detail.component.css']
})
export class PictureDetailComponent implements OnInit, OnDestroy {
  commentsArray: commentObjectWithLikedBoolean[];
  mainImageSrc: string;
  liked:boolean = true;
  postingNewComment:boolean = false;
  username:string;
  commentControl = new FormControl("", Validators.required);
  avatarPrefix = "/avatars";
  pictureTitle: string;
  previousPicture:string;
  nextPicture:string;
  componentDestroyed: Subject<boolean> = new Subject();

  constructor(private ajax:CommentsService, private user:AuthenticationService, private route:ActivatedRoute ) {
  }

  ngOnInit() {
    this.username = this.user.currentUser;

    this.route.data
    .pipe( takeUntil(this.componentDestroyed) )
    .subscribe((data) => {

      this.commentControl.reset();

      const commentDoc = data.commentDoc as PictureDetailModel;
      this.nextPicture = commentDoc.nextPicture;
      this.previousPicture = commentDoc.previousPicture;
      this.pictureTitle = commentDoc._id.pictureTitle;
      this.commentsArray = commentDoc.comments;
      this.mainImageSrc = commentDoc.originalSrc;
    });

    //when you pass false, oldArray gets updated to the new value
    this.route.data.pipe(
      switchMap( () => this.ajax.commentsArrayStream$ ),
      distinctUntilChanged((oldArray, newArray) => {

          if(newArray.length !== oldArray.length){
            return false;
          }
          else if( this.numberOflikesDiffer(oldArray, newArray) ){
            return false;
          }
          else {
            return true;
          }

      }),
      takeUntil(this.componentDestroyed)
    )
    .subscribe(
      commentArray => {
        this.commentsArray = commentArray
        /*It is imperative that we copy by reference so that this.commentsArray and oldArray in
          distinctUntilChanged refer the same object.

          When the user likes a commment, we update the view, mutate this.commentsArray and mutate the value of oldArray in distinctUntilChanged.

          The next time distinctUntilChanged is run with the new value from the server, if
          the only change that occured is that the user has liked a comment (and not some other user on a different client doing any other action), distinctUntilChanged
          will return true.
          This ensures that we do not do an unnecessary round of change detection since the view has already been updated locally for the user liking a comment

          There is an unnecessary round of change detection that occurs during the first interval of this.ajax.commentsArrayStream$ because distinctUntilChanged only kicks
          in after 2 values have passed through. I have yet to deal with this.
        */
});


  }
  ngOnDestroy(){
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
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
      this.ajax.addANewComment(text)
      .subscribe(x => {
        this.ajax.resetTimer();
        this.commentControl.reset();
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
  numberOflikesDiffer(oldArray:commentObjectWithLikedBoolean[], newArray:commentObjectWithLikedBoolean[]):boolean{
    return newArray.some((comment, index) => comment.likes !== oldArray[index].likes );
  }
}
