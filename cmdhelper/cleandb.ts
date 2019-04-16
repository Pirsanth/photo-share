import mongo from "mongodb"
import {MongoClient, Db} from "mongodb"

var usedClient:MongoClient = null;

//Its not really necessary to list them out one by one but I like to be explicit

mongo.MongoClient.connect("mongodb://localhost:27017/photoShare", {useNewUrlParser: true})
.then(client => {usedClient = client; return client.db()})
.then( db => {
  return Promise.all([ clearCollection("albums", db),
                       clearCollection("users", db),
                       clearCollection("comments", db),
                       clearCollection("refreshTokens", db)
                      ])
})
.then(()=> console.log("The PhotoShare db has been emptied"))
.then(() => usedClient.close())
.catch(e => console.log(e));

async function clearCollection(collectionName:string, db:Db):Promise<boolean>{
  var collection = await db.collection(collectionName)
  await collection.deleteMany({})
  return true;
}
