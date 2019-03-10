import { getAnAlbum, getAllAlbums, getAlbumsList, addNewPictures } from "../model/manageAlbums";
import { Picture } from "../customTypes";
import {Request, Response, NextFunction} from "express";

function getAllAlbumsJSON(req: Request, res: Response){
    getAllAlbums()
    .then((array) => res.status(200).json({error: null, data: array}))
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "Error retrieving albums from the database"})
    })
}

function getAnAlbumJSON(req: Request, res: Response){
   const albumName = req.params["albumName"];

    getAnAlbum(albumName)
    .then((album) => {
        if(album){
        res.status(200).json({error: null, data: album})
        }
        else{
          res.status(404).json({error: "The album was not found"})
        }
      })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: `Error retrieving album ${albumName} from the database`})
    })
}

async function getListOfAvailableAlbums(req: Request, res: Response){
 try{
   const albumsNameArray = await getAlbumsList();
   res.status(200).json({error: null, data: albumsNameArray});
 }
 catch(err){
   res.status(500).json({error:`Server error while trying to retrieve the list of albums`});
 }
}

function  savePictureJSONsToDatabase (req: Request, res: Response){
  let pictureArray:Picture[] = [];

  let fileArray =  req.files as Express.Multer.File[];
  fileArray.forEach((file, index) =>{
    var picture = new Picture( req.body[`pictureTitle${index}`] || file.filename ,
                  req.payload.username, file.filename);
    pictureArray.push(picture);
  })

    addNewPictures(req.body.albumName , pictureArray)
    .then( x => {res.status(201);
                 res.append('Location', `/albums/${req.body.albumName}`);
                 res.send();
                 })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "There was an error saving the image json to the database"})
    })
}


export default { getAllAlbumsJSON, getAnAlbumJSON, getListOfAvailableAlbums, savePictureJSONsToDatabase };
