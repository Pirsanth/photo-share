import {getCollectionFactory} from "./sharedDB";
let getCollection = getCollectionFactory("refreshTokens");
import { RefreshTokensDocument } from "../customTypes";

export async function registerNewRefreshToken(refreshTokenId:string, username:string){
    const docToInsert = new RefreshTokensDocument(refreshTokenId, username);

    const collection = await getCollection();
    const {result} = await collection.insertOne(docToInsert);
    return result;
}

export async function findRefreshToken(refreshTokenId:string):Promise<RefreshTokensDocument | null>{
    const collection = await getCollection();
    const document = await collection.findOne({_id:refreshTokenId});
    return document;
}

export async function invalidateRefreshToken(refreshTokenId:string){
    const collection = await getCollection();
    const {result} = await collection.deleteOne({_id:refreshTokenId});
    return result;
}
