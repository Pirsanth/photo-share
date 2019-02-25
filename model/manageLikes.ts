import {getCollectionFactory} from "./sharedDB";
import {Picture, PictureData, Album} from "../server/customTypes";
let getCollection = getCollectionFactory("albums");
import { Response, Request } from "express";

type likeOrDislike = 1 | -1;

export async function addLikes(albumName:string, pictureTitle: string, likeOrDislike: 1 | -1, username: string, res: Response){
  try{
    const queryObject = { _id:albumName, picsSrc: { $elemMatch: {title:pictureTitle,"voters.name":{$ne: username}}}};
    const updateObject = {$inc: {"picsSrc.$.likes": likeOrDislike}, $push:{"picsSrc.$.voters": {name: username, value: likeOrDislike}}};

    const collection = await getCollection();
    const {result} = await collection.updateOne(queryObject , updateObject, {upsert: false });
    console.log(result);
    if(result.nModified){
      res.status(204).send();
    }
    else{
      res.status(400).json({error: "Either the picture or album does not exist or the user has already voted"});
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a problem accessing the database when trying to add likes"})
  }
}

export async function editLikes(req: Request, res: Response){

  const albumName = req.params["albumName"];
  const pictureTitle = req.params["pictureTitle"];

  // TODO: Check that the old and new values are opposites
  const username:string = req.body.username;
  const oldValue:likeOrDislike = req.body.oldValue;
  const newValue:likeOrDislike = req.body.newValue;

  if(oldValue === newValue){
    res.status(400).json({error: "Old and new values must not match"});
    return;
  }


  try{
    const queryObject = { _id:albumName, picsSrc: { $elemMatch: {title:pictureTitle,"voters": {name: username, value: oldValue}}}};
    const updateObject = {$inc: {"picsSrc.$.likes": newValue*2}, $set: { "picsSrc.$.voters.$[previousVote].value": newValue} };

    const collection = await getCollection();
    const {result} = await collection.updateOne(queryObject , updateObject, {upsert: false, arrayFilters: [{previousVote: {name: username, value: oldValue}}] });
    console.log(result);
    if(result.nModified){
      res.status(204).send();
    }
    else{
      res.status(400).json({error: "Either the picture or album does not exist or the oldValue is incorrect"});
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a problem accessing the database when trying to add likes"})
  }
}

export async function removeLikes(req: Request, res: Response){
  const albumName = req.params["albumName"];
  const pictureTitle = req.params["pictureTitle"];

  const username = req.body.username;
  const oldValue:likeOrDislike = req.body.oldValue;

  // db.survey.update( { _id: 1 }, { $pullAll: { scores: [ 0, 5 ] } } )
  try{
    const queryObject = { _id:albumName, picsSrc: { $elemMatch: {title:pictureTitle, "voters":{$elemMatch: {name: username, value: oldValue}}}}};
  //  const updateObject = {$pullAll: {picSrc}};
//db.survey.update( { _id: 1 }, { $pullAll: { scores: [ 0, 5 ] } } )
    const collection = await getCollection();
    const {result} = await collection.updateOne(queryObject , updateObject, {upsert: false });
    console.log(result);
    if(result.nModified){
      res.status(204).send();
    }
    else{
      res.status(400).json({error: "Either the picture or album does not exist or the user has already voted"});
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json({error: "There was a problem accessing the database when trying to add likes"})
  }
}
