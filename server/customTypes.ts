
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
  originalSrc: string;
  thumbnailSrc:string;
  constructor(private title:string, private uploadedBy: string, filename: string){
    this.originalSrc = `originals/${filename}`;
    this.thumbnailSrc = `thumbnails/${filename}`;
  }
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
