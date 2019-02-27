import express from "express";
const router = express.Router();
import controller from "../controllers/comments";
import likesController from "../controllers/commentLikes";


router.get("/:albumName/:pictureTitle", controller.retrieveComments);

router.post("/:albumName/:pictureTitle", controller.addComment);

router.post("/likes/:albumName/:pictureTitle", likesController.addLikes);

router.delete("/likes/:albumName/:pictureTitle", likesController.removeLikes );


export default router;
