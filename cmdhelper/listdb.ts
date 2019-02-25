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
    const albumIndex:string = process.argv[3];
    const pictureIndex:string = process.argv[4];
    //keep is as a string so if is truthy when the pictureIndex is 0 ("0")  
    if(pictureIndex){
      console.log(arr[albumIndex].picsSrc.reverse()[pictureIndex])
    }
    else{
      console.log(arr[albumIndex].picsSrc.reverse())
    }
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
