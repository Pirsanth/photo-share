import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { CommentsDocument, commentObjectWithLikedBoolean } from "../customTypes";
import { CommentsService } from "../services/comments.service";

@Injectable({
  providedIn: 'root'
})
//CommentsDocument<commentObjectWithLikedBoolean>
export class PictureDetailResolverService implements Resolve<CommentsDocument<commentObjectWithLikedBoolean>> {
  constructor(private fetchComments:CommentsService) { }
  resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
    this.fetchComments.pictureTitle = route.paramMap.get("pictureTitle");
    this.fetchComments.albumName = route.paramMap.get("albumName");
    return this.fetchComments.getCommentDocument();
  }
}
