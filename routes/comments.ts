import express from "express";
const router = express.Router();
import controller from "../controllers/comments";
import likesController from "../controllers/commentLikes";
import { checkAccessToken } from "../middlewares/auth";

router.get("/:albumName/:pictureTitle", controller.retrieveComments);

router.post("/:albumName/:pictureTitle", checkAccessToken,controller.addComment);

router.delete("/:albumName/:pictureTitle", checkAccessToken, controller.removeComment);

router.post("/likes/:albumName/:pictureTitle", checkAccessToken,likesController.addLikes);

router.delete("/likes/:albumName/:pictureTitle", checkAccessToken,likesController.removeLikes );


export default router;
