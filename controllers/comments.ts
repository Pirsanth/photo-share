import * as model from "../model/manageComments";
import { CommentsDocument, Comment } from "../customTypes";
import { Request, Response } from "express";


async function retrieveComments(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const document: CommentsDocument | null  = await model.getCommentsDocument(albumName, pictureTitle)
    if(document){
      res.status(200).json({error: null, data: document});
    }
    else{
      res.status(404).json({error: "The requested comments document could not be found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a server error while retrieving the comments document from the database"});
  }
}

async function addComment(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const body: {text: string} = req.body;
    const comment = new Comment(body.text, req.payload.username);
    const result = await model.addComment(albumName, pictureTitle, comment);

    if(result.n){
      res.status(204).send();
    }
    else{
      res.status(404).json({error: "The picture title or album cannot be found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a server error while adding the comment"});
  }
}

async function removeComment(req: Request, res: Response){
  try{
    const albumName = req.params["albumName"];
    const pictureTitle = req.params["pictureTitle"];

    const body: {commentId: string} = req.body;

    const result = await model.removeComment(albumName, pictureTitle, body.commentId, req.payload.username);

    const { n, nModified } = result;

    if(n){
      if(n && nModified){
        res.status(204).send();
      }
      else{
        res.status(403).json({error: "You are unauthorized to remove a comment made by another user"});
      }
    }
    else{
      res.status(404).json({error: "The comment to remove cannot be found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a server error while attempting to remove the comment"});
  }
}

export default { addComment, retrieveComments, removeComment }
