import express from "express";
const router = express.Router();
import controller from "../controllers/albums";
import likesController from "../controllers/pictureLikes";
import { makeThumbnails } from "../middlewares/photos";
import { upload } from "../middlewares/multerSetup";
import { checkAccessToken } from "../middlewares/auth";
import { Validators } from "../middlewares/validators";
import albumValidators = Validators.Albums

router.get("/", controller.getAllAlbumsJSON);

router.get("/albumsList/", controller.getListOfAvailableAlbums);

router.get("/:albumName/", controller.getAnAlbumJSON);

router.post("/", checkAccessToken, upload.array("picture", 5), albumValidators.validateAddPictures, makeThumbnails, controller.savePictureJSONsToDatabase);

router.post("/likes/:albumName/:pictureTitle", checkAccessToken, albumValidators.validateAddLikes, likesController.addLikes );

router.put("/likes/:albumName/:pictureTitle", checkAccessToken, albumValidators.validateEditLikes, likesController.editLikes );

router.delete("/likes/:albumName/:pictureTitle", checkAccessToken, albumValidators.validateDeleteLikes, likesController.removeLikes );

export default router;
