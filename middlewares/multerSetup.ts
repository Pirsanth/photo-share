import multer from "multer";
import {Request} from "express";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/originals`);
  },
  filename: function (req: Request, file, cb) {
    // TODO: make the .jpg dynamically set
    let albumName = req.params.albumName;
    cb(null, `${albumName}-${Date.now()}.jpg`);
  }
})

export let upload = multer({ storage: storage });
