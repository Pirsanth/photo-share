import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { PictureDetailModel } from "../customTypes";
import { CommentsService } from "../services/comments.service";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { AlbumsService } from "../services/albums.service";

@Injectable({
  providedIn: 'root'
})
//CommentsDocument<commentObjectWithLikedBoolean>
//export class PictureDetailResolverService implements Resolve<CommentsDocument<commentObjectWithLikedBoolean>> {
export class PictureDetailResolverService implements Resolve<PictureDetailModel> {
  constructor(private comments:CommentsService, private albums:AlbumsService) { }
  resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){

    this.comments.pictureTitle = route.paramMap.get("pictureTitle");
    this.comments.albumName = route.paramMap.get("albumName");

    return forkJoin(
      this.comments.getCommentDocument(),
      this.albums.getAnAlbum(route.paramMap.get("albumName"))
    ).pipe(map(( [commentDoc, albumDoc]) => {

      var pictureTitle = commentDoc._id.pictureTitle;
      var pictureIndex = albumDoc.picsSrc.findIndex((picture) => picture.title === pictureTitle);
      var previousPicture = (pictureIndex > 0)? albumDoc.picsSrc[pictureIndex-1].title : "";
      var nextPicture = (pictureIndex+1 !== albumDoc.picsSrc.length)? albumDoc.picsSrc[pictureIndex+1].title : "";

      return {...commentDoc, previousPicture, nextPicture}
    }))

  }
}
