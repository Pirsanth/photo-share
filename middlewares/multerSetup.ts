import multer from "multer";
import {Request} from "express";

/*
From the documentation:
  Note that req.body might not have been fully populated yet.
  It depends on the order that the client transmits fields and files to the server.
 */

let storage = multer.diskStorage({
  destination: function (req:Request, file, cb) {
    console.log(req.baseUrl)
    console.log(req.url)
    if(req.baseUrl === "/auth"){
      cb(null, 'public/temp');
    }
    else if(req.baseUrl === "/albums"){
      cb(null, `public/originals`);
    }
  },
  filename: function (req: Request, file, cb) {
    // TODO: make the .jpg dynamically set
    if(req.baseUrl === "/auth"){
      cb(null, `${Date.now()}.jpg`);
    }
    else if(req.baseUrl === "/albums"){
      let albumName = req.params.albumName;
      cb(null, `${albumName}-${Date.now()}.jpg`);
    }
  }
})

export let upload = multer({ storage: storage });
