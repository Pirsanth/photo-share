//const mongodb = require('mongodb');
import mongodb from "mongodb";
import {Collection, MongoError, Db, MongoCallback} from "mongodb";
let sharedDb: Db = null;

const connectionString = process.env["MONGODB_CONNECTION_STRING"];

export let initializeConnection:() => Promise<void> = function () {
    return mongodb.MongoClient.connect(connectionString, {useNewUrlParser: true})
           .then(client => {sharedDb = client.db();
                            return; });
}


export let getCollectionFactory: (collectionName: string) => () => Promise<Collection> = function (collectionName) {
  return function(){
    return new Promise((resolve, reject) =>{
      sharedDb.collection(collectionName, function(err: MongoError, collection) {
        if(err){
          reject(err);
          return;
        }
        resolve(collection)
      });

    })
  }
}
