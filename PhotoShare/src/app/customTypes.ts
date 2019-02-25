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
  constructor(private title:string, private uploadedBy: string, filename: string){
    this.originalSrc = `originals/${filename}`;
    this.thumbnailSrc = `thumbnails/${filename}`;
  }
}
interface votes {
  name: string;
  value: 1 | -1
}
