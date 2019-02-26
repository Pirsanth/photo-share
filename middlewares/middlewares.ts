import {Request, Response, NextFunction} from "express";
import jimp from "jimp";
import {addNewPictures} from "../model/manageAlbums";

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;


export let makeThumbnails:MiddlewareFunction = function (req, res, next){
  let fileArray =  req.files as Express.Multer.File[];
  Promise.all(fileArray.map((file) => createAThumbnail(file.filename)))
  .then(x => next())
  .catch(err => {console.log(err)
                 res.status(500).json({error: "There was a problem creating the thumbnails"})
                });

  function createAThumbnail(filename:string):Promise<jimp>{
    return  jimp.read(`public/originals/${filename}`)
            .then(img => {
              return img
              .cover(350, 350)
              .write(`public/thumbnails/${filename}`);
             })
 }
}
