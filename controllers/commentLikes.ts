import { Request, Response } from "express";
import * as model from "../model/manageCommentLikes";

async function addLikes(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const body: { username: string, commentId: string } = req.body;
    const result = await model.addLikes(albumName, pictureTitle, body.username, body.commentId);
    if(result.n){
      res.status(204).send();
    }
    else{
      res.status(404).json({error: "The comment to like cannot be found or the given user has already liked the comment"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "A server error occured while adding the likes to the comment"});
  }
}

async function removeLikes(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const body: { username: string, commentId: string } = req.body;
    const result = await model.removeLikes(albumName, pictureTitle, body.username, body.commentId);
    
    if(result.n){
      res.status(204).send();
    }
    else{
      res.status(404).json({error: "The comment to remove cannot be found or the given user has not already liked the comment"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "A server error occured while removing the likes on the comment"});
  }
}




export default { addLikes, removeLikes }
