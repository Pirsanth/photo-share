
import express from "express";
import {Request} from "express"

import {makeThumbnail, extractFormData, savePictureJSONToDatabase} from "./middlewares";
import {geAllAlbums} from "../model/manageAlbums";
import {upload} from "./multerSetup";
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static('public/'));

app.get("/", function (req, res) {
    res.status(300).send({error: "An error occured"});
})
app.get("/albums/", function(req, res){
    geAllAlbums()
    .then((array) => res.status(200).json({error: null, data: array}))
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "Error retrieve albums from the database"})
    })
})
app.post("/albums/:albumName", upload.single("picture"),extractFormData, makeThumbnail, savePictureJSONToDatabase, function (req, res) {
    res.status(200).json({error: null, data: "Picture successfully added"});
})



app.listen(3000);
