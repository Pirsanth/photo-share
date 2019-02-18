import {Request,Response, NextFunction} from "express";
import jimp from "jimp";
import {addNewPicture} from "../model/manageAlbums";
import {Picture} from "./customTypes";
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;


export let extractFormData:MiddlewareFunction = function (req, res, next){
  try{
    req.pictureData = {
        uploadedBy: req.body.username,
        albumName: req.body.albumName,
        pictureTitle: req.body.pictureTitle,
        username: req.body.username,
        originalSrc: `originals/${req.file.filename}`,
        thumbnailSrc: `thumbnails/${req.file.filename}`
      }
  }
  catch(e){
    console.log(e);
    res.status(400).json({error: "The form data was incomplete"})
  }
  next();
}
export let makeThumbnail:MiddlewareFunction = function (req, res, next){
  jimp.read(`public/${req.pictureData.originalSrc}`)
        .then(img => {
          return img
                .cover(350, 350)
                .write(`public/${req.pictureData.thumbnailSrc}`);
        })
        .then(()=> next())
        .catch((err) =>{
          console.log(err);
          res.status(500).json({error: "There was an error creating the thumbnail"})
        })
}
export let savePictureJSONToDatabase:MiddlewareFunction = function (req, res, next){
    var picture = new Picture(req.pictureData.pictureTitle, req.pictureData.originalSrc,
                              req.pictureData.thumbnailSrc, req.pictureData.username);
    addNewPicture(req.pictureData.albumName, picture)
    .then(x => next())
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "There was an error saving the image json to the database"})
    })
}
