import express from "express";
const router = express.Router();
import controller from "../controllers/albums";
import { makeThumbnails } from "../middlewares/middlewares";
import { upload } from "../middlewares/multerSetup";

//the base url is albums

router.get("/", controller.getAllAlbumsJSON);

// TODO: Fix the route for this on the frontend
router.get("/albumsList/", controller.getListOfAvailableAlbums);

router.get("/:albumName/", controller.getAnAlbumJSON);

router.post("/:albumName/", upload.array("picture"), makeThumbnails, controller.savePictureJSONsToDatabase);


export default router;
