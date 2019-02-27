import { getCollectionFactory } from "./sharedDB";
import {Picture, PictureData, Album} from "../customTypes";
let getCollection = getCollectionFactory("comments");

type likeOrDislike = 1 | -1;

export async function addLikes(albumName:string, pictureTitle: string, username: string, commentId: string){
    const queryObject = { _id:{albumName, pictureTitle}, comments:{ $elemMatch: {commentId, voters:{$ne: username}} } };
    const updateObject = { $inc:{"comments.$.likes": 1}, $push:{"comments.$.voters":username} }

    const collection  = await getCollection();
    const {result} = await collection.updateOne(queryObject, updateObject, {upsert: false});
    return result;
}

export async function removeLikes(albumName:string, pictureTitle: string, username: string, commentId: string){
  const queryObject = { _id:{albumName, pictureTitle}, comments:{ $elemMatch: {commentId, voters: username} } };
  const updateObject = { $inc:{"comments.$.likes": -1}, $pullAll:{"comments.$.voters":[username]} }

  const collection  = await getCollection();
  const {result} = await collection.updateOne(queryObject, updateObject, {upsert: false});
  return result;
}
