
import express from "express";
import {Request} from "express"

//import {makeThumbnails, extractFormData, savePictureJSONsToDatabase} from "./middlewares";
//import {getAllAlbums, getAnAlbum, getAlbumsList} from "../model/manageAlbums";
//import { addLikes, removeLikes, editLikes} from "../model/manageLikes";
//import {upload} from "./multerSetup";
var cors = require("cors");


const app = express();


app.get("/", function (req, res) {
    res.status(300).send({error: "An error occured"});
});
app.get("/albums/", function(req, res){
    getAllAlbums()
    .then((array) => res.status(200).json({error: null, data: array}))
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "Error retrieving albums from the database"})
    })
});
app.get("/albums/:albumName", function(req, res){
   const albumName = req.params["albumName"];

    getAnAlbum(albumName)
    .then((album) => {
        if(album){
        res.status(200).json({error: null, data: album})
        }
        else{
          res.status(404).json({error: "The album was not found"})
        }
      })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: `Error retrieving album ${albumName} from the database`})
    })
});
app.get("/albumsList/", async function(req, res){
  try{
    const albumsNameArray = await getAlbumsList();
    res.status(200).json({error: null, data: albumsNameArray});
  }
  catch(err){
    res.status(500).json({error:`Server error while trying to retrieve the list of albums`});
  }

});

app.post("/albums/:albumName/", upload.array("picture"), makeThumbnails, savePictureJSONsToDatabase, function (req, res) {
    // TODO: add a location header to the created album
    res.status(201).json({error: null, data: "Picture(s) successfully added"});
});
app.post("/likes/:albumName/:pictureTitle", function(req, res){
  const albumName = req.params["albumName"];
  const pictureTitle = req.params["pictureTitle"];

  const username = req.body.username;
  const likeOrDislike = req.body.likeOrDislike;

  addLikes(albumName, pictureTitle, likeOrDislike, username, res)

});
app.put("/likes/:albumName/:pictureTitle", function(req, res){
    editLikes(req, res);
})
app.delete("/likes/:albumName/:pictureTitle", function(req, res){
    removeLikes(req, res);
})
app.listen(3000);
