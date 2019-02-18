export interface Album{
  _id: string,
  numberOfPics: number,
  numberOfComments?: number,
  picsSrc: Picture[]
}
export class Picture{
  score: number = 0;
  voters: number[] = [];
  numberOfComments: number = 0;
  constructor(public title:string, public originalSrc:string, public thumbnailSrc:string,public uploadedBy: string){
  }
}
