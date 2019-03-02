import express from "express";
const router = express.Router();
import controller from "../controllers/albums";
import likesController from "../controllers/pictureLikes";
import { makeThumbnails } from "../middlewares/photos";
import { upload } from "../middlewares/multerSetup";
//the base url is albums

router.get("/", controller.getAllAlbumsJSON);

router.get("/albumsList/", controller.getListOfAvailableAlbums);

router.get("/:albumName/", controller.getAnAlbumJSON);

router.post("/:albumName/", upload.array("picture"), makeThumbnails, controller.savePictureJSONsToDatabase);

router.post("/likes/:albumName/:pictureTitle", likesController.addLikes );

router.put("/likes/:albumName/:pictureTitle", likesController.editLikes );

router.delete("/likes/:albumName/:pictureTitle", likesController.removeLikes );

export default router;
