import {getCollectionFactory} from "./sharedDB";
import {Picture, PictureData, Album} from "../server/customTypes";
let getCollection = getCollectionFactory("albums");


export function addNewPicture(albumName:string, picture:Picture) {
  return getCollection()
         .then(coll => coll.updateOne({_id: albumName}, { $inc: {numberOfPics: 1}, $push: {picsSrc: picture}}, {upsert: true}))
}

const projectionObject = { picsSrc: {$slice: -4} };
export function geAllAlbums():Promise<Album[]> {
  return getCollection()
         .then(coll => coll.find({},{projection: projectionObject}))
         .then(cursor => cursor.toArray())
}
