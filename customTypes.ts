import uuid from "uuid/v4";
import {Request, Response, NextFunction} from "express";

declare global {
  namespace Express {
    interface Request{
      payload: {username: string};
    }
  }
}

export class Picture{
  likes: number = 0;
  voters: votes[] = [];
  numberOfComments: number = 0;
  originalSrc: string;
  thumbnailSrc:string;
  constructor(public title:string, public uploadedBy: string, filename: string){
    const encodedFilename = encodeURIComponent(filename);
    this.originalSrc = `originals/${encodedFilename}`;
    this.thumbnailSrc = `thumbnails/${encodedFilename}`;
  }
}
interface votes {
  name: string;
  value: 1 | -1
}
export interface PictureData {
  originalSrc: string;
  thumbnailSrc: string;
  albumName: string;
  pictureTitle:string;
  username: string;
}

export interface Album{
  _id: string,
  numberOfPics: number,
  numberOfComments: number,
  picsSrc: Picture[]
}

export interface commentObject{
  text: string;
  commentId: string;
  commentAuthorUsername: string;
  likes: number;
  voters: string[]; //string of other usernames
}
export class Comment implements commentObject{
  voters = [];
  likes = 0;
  commentId: string;
  constructor( public text:string, public commentAuthorUsername: string ){
      this.commentId = uuid();
    }
}

export class CommentsDocument {
  _id: {albumName: string, pictureTitle: string};
  comments: commentObject[] = [];
  constructor( albumName:string, pictureTitle: string, public pictureUploadedBy: string, public originalSrc: string ){
    this._id = { albumName, pictureTitle };
  }
}
export class User {
  _id:string;
  constructor(username, public passwordHash){
    this._id = username;
  }
}

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;

export class RefreshTokensDocument{
  _id:string;
  constructor(refreshTokenId:string, public username:string){
    this._id = refreshTokenId;
  }
}
