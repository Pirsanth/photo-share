import mongo from "mongodb"
import {MongoClient} from "mongodb"

var usedClient:MongoClient = null;

mongo.MongoClient.connect("mongodb://localhost:27017/photoShare", {useNewUrlParser: true})
.then(client => {usedClient = client; return client.db()})
.then(db => db.collection("albums"))
.then(coll => coll.deleteMany({}))
.then(()=> console.log("The albums db collection has been emptied"))
.then(() => usedClient.close())
.catch(e => console.log(e));
