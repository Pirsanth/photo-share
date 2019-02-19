import {Request, Response, NextFunction} from "express";
import jimp from "jimp";
import {addNewPictures} from "../model/manageAlbums";
import {Picture} from "./customTypes";
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;


export let extractFormData:MiddlewareFunction = function (req, res, next){
  try{
    req.pictureData = {
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
//a||b //if a is false b is sent

//pictureTitle1

export let savePictureJSONsToDatabase:MiddlewareFunction = function (req, res, next){
  let pictureArray:Picture[] = [];

  let fileArray =  req.files as Express.Multer.File[];
  fileArray.forEach((file, index) =>{
    var picture = new Picture( req.body[`pictureTitle${index}`] || file.filename ,
                  req.body.username, file.filename);
    pictureArray.push(picture);
  })

    addNewPictures(req.body.albumName , pictureArray)
    .then(x => next())
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "There was an error saving the image json to the database"})
    })
}
