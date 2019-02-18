import mongo from "mongodb"
import {MongoClient} from "mongodb";

var usedClient:MongoClient = null;

function isZoomSpecified():boolean{
  return (process.argv[2] === "z")? true: false;
}



mongo.MongoClient.connect("mongodb://localhost:27017/photoShare", {useNewUrlParser: true})
.then(client =>{usedClient = client; return client.db()})
.then(db => db.collection("albums"))
.then(coll => coll.find({}))
.then((cur)=> cur.toArray())
.then((arr: Album[]) => {
  if(isZoomSpecified()){
    const index:number = +process.argv[3];
    console.log(arr[index].picsSrc)
  }
  else{
    console.log(arr)
  }
})
.then(() => usedClient.close())
.catch(e => console.log(e));

interface Album {
  numberOfPics: number
  picsSrc:[]
  numberOfComments?: number
}
