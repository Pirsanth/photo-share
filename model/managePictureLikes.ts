import {getCollectionFactory} from "./sharedDB";
let getCollection = getCollectionFactory("albums");

type likeOrDislike = 1 | -1;

export async function addLikes(albumName:string, pictureTitle: string, likeOrDislike: 1 | -1, username: string){
    const queryObject = { _id:albumName, picsSrc: { $elemMatch: {title:pictureTitle,"voters.name":{$ne: username}}}};
    const updateObject = {$inc: {"picsSrc.$.likes": likeOrDislike}, $push:{"picsSrc.$.voters": {name: username, value: likeOrDislike}}};

    const collection = await getCollection();
    const {result} = await collection.updateOne(queryObject , updateObject, {upsert: false });
    return result;
}

export async function editLikes(albumName:string, pictureTitle:string, username:string, oldValue:likeOrDislike, newValue:likeOrDislike){
    const queryObject = { _id:albumName, picsSrc: { $elemMatch: {title:pictureTitle, "voters": {name: username, value: oldValue}}}};
    const updateObject = {$inc: {"picsSrc.$.likes": newValue*2}, $set: { "picsSrc.$.voters.$[previousVote].value": newValue} };

    const collection = await getCollection();
    const {result} = await collection.updateOne(queryObject , updateObject, {upsert: false, arrayFilters: [{previousVote: {name: username, value: oldValue}}] });

    return result
}

export async function removeLikes(albumName:string, pictureTitle:string, username:string, oldValue:likeOrDislike){
    const queryObject = { _id:albumName, picsSrc: { $elemMatch: {title:pictureTitle, "voters":{name: username, value: oldValue} }}};
    const updateObject = {$pullAll: {"picsSrc.$.voters": [{name: username, value: oldValue}] }, $inc: {"picsSrc.$.likes": -oldValue}};

    const collection = await getCollection();
    const {result} = await collection.updateOne(queryObject , updateObject, {upsert: false });
    return result;
}
