import * as model from "../model/managePictureLikes";
import { Request, Response } from "express";
type likeOrDislike = 1 | -1;

async function addLikes (req: Request, res: Response) {
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const username = req.body.username;
    const likeOrDislike = req.body.likeOrDislike;

    const result = await model.addLikes(albumName, pictureTitle, likeOrDislike, username)

    if(result.nModified){
      res.status(204).send();
    }
    else{
      res.status(400).json({error: "Either the picture or album does not exist or the user has already voted"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a problem accessing the database when trying to add likes"});
  }
}

async function editLikes(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const username:string = req.body.username;
    const oldValue:likeOrDislike = req.body.oldValue;
    const newValue:likeOrDislike = req.body.newValue;

    if(oldValue === newValue){
      res.status(400).json({error: "Old and new values must not match"});
      return;
    }

    const result = await model.editLikes(albumName, pictureTitle, username, oldValue, newValue);

    if(result.nModified){
      res.status(204).send();
    }
    else{
      res.status(400).json({error: "Either the picture or album does not exist or the oldValue is incorrect"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a problem accessing the database when trying to edit likes"})
  }
}

async function removeLikes(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const username = req.query.username;
    const oldValue:likeOrDislike = +req.query.oldValue as likeOrDislike;

    const result = await model.removeLikes(albumName, pictureTitle, username, oldValue);

    if(result.nModified){
      res.status(204).send();
    }
    else{
      res.status(400).json({error: "The vote to delete cannot be found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a problem accessing the database when trying to remove likes"})
  }
}


export default { addLikes, editLikes, removeLikes }
