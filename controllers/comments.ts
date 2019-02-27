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

    const body: {text: string, username: string} = req.body;
    const comment = new Comment(body.text, body.username);
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


export default { addComment, retrieveComments }
