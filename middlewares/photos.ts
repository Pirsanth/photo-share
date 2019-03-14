
import jimp from "jimp";
import { MiddlewareFunction } from "../customTypes";


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

export let makeUserAvatar:MiddlewareFunction = async function (req, res, next){
  let singleFile =  req.file as Express.Multer.File;
  const username = req.body.username;

    try{
      await  createAThumbnail(singleFile.filename, username)
      next();
    }
    catch(err){
      console.log(err);
      res.status(500).json({error: "There was a problem creating the user avatar"})
    }

  function createAThumbnail(filename:string, username:string):Promise<jimp>{
    return  jimp.read(`public/temp/${filename}`)
            .then(img => {
              return img
              .cover(350, 350)
              .write(`public/avatars/${username}.jpg`);
             })
 }
}
