import {getCollectionFactory} from "./sharedDB";
import {Picture, CommentsDocument, commentObject } from "../customTypes";
let getCollection = getCollectionFactory("comments");


export async function addEmptyCommentsDocuments(albumName:string, picturesArray: Picture[]){
  const commentArray: Array<CommentsDocument> = picturesArray.map( picture => new CommentsDocument(albumName, picture.title, picture.uploadedBy, picture.originalSrc) );
  const collection = await getCollection();
  const {result} = await collection.insertMany(commentArray)
  return result;
}

export async function addComment(albumName:string, pictureTitle:string, comment:commentObject){
  const collection = await getCollection();
  const {result} = await collection.updateOne({_id:{albumName, pictureTitle}}, {$push: {comments: comment}}, {upsert: false})
  return result;
}

export async function getCommentsDocument(albumName:string, pictureTitle:string):Promise<CommentsDocument|null>{
  const collection = await getCollection();
  const document = await collection.findOne( {_id: {albumName, pictureTitle} } )
  return document;
}
