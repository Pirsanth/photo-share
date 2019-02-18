
declare global {
  namespace Express {
    interface Request{
      pictureData: PictureData
    }
  }
}

export class Picture{
  score: number = 0;
  voters: number[] = [];
  numberOfComments: number = 0;
  constructor(private title:string, private originalSrc:string, private thumbnailSrc:string,private uploadedBy: string){
  }
}

export interface PictureData {
  originalSrc: string;
  thumbnailSrc: string;
  uploadedBy: string;
  albumName: string;
  pictureTitle:string;
  username: string;
}

export interface Album{
  _id: string,
  numberOfPics: number,
  numberOfComments?: number,
  picsSrc: Picture[]
}
