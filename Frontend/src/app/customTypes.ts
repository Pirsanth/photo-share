import { Observable } from "rxjs";

export interface Album{
  _id: string,
  numberOfPics: number,
  numberOfComments: number,
  picsSrc: Picture[]
}
export class Picture{
  likes: number = 0;
  voters: votes[] = [];
  numberOfComments: number = 0;
  originalSrc: string;
  thumbnailSrc:string;
  constructor(public title:string, private uploadedBy: string, filename: string){
    this.originalSrc = `originals/${filename}`;
    this.thumbnailSrc = `thumbnails/${filename}`;
  }
}
interface votes {
  name: string;
  value: 1 | -1
}

export interface commentObject{
  text: string;
  commentId: string;
  commentAuthorUsername: string;
  likes: number;
  voters: string[]; //string of other usernames
}
export interface commentObjectWithLikedBoolean extends commentObject{
  liked: boolean;
}

export class CommentsDocument<T>{
  _id: {albumName: string, pictureTitle: string};
  comments: Array<T> = [];
  constructor( albumName:string, pictureTitle: string, public pictureUploadedBy: string, public originalSrc: string ){
    this._id = { albumName, pictureTitle };
  }
}
export class PictureDetailModel extends CommentsDocument<commentObjectWithLikedBoolean>{
  previousPicture: string;
  nextPicture:string;
}
export interface FormComponent {
  canDeactivate():Observable<boolean> | boolean
}
export interface stateObject {
  show: boolean,
  message?:string
}

export interface FormState {
  simpleValues: {
    useExisting:boolean,
    previewSrc:boolean,
    customPictureTitle:boolean
  },
  partialFormGroupValues: any,
}

export enum FeatureArea {
  addPictures=1,
  users
}
