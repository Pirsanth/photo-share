import { getCollectionFactory } from "./sharedDB";
import { User } from "../customTypes";
let getCollection = getCollectionFactory("users");


export async function addNewUser(user:User){
    const collection  = await getCollection();
    const {insertedCount} = await collection.insertOne(user);
    return insertedCount;
}

export async function findUser(username:string){
    const collection  = await getCollection();
    const result = await collection.findOne({_id:username});
    return result;
}
