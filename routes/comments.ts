import express from "express";
const router = express.Router();
import controller from "../controllers/comments";
import likesController from "../controllers/commentLikes";
import { checkAccessToken } from "../middlewares/auth";
import { Validators } from "../middlewares/validators";
import cValidators = Validators.Comments;

router.get("/:albumName/:pictureTitle", controller.retrieveComments);

router.post("/:albumName/:pictureTitle", checkAccessToken, cValidators.validateComment, controller.addComment);

router.delete("/:albumName/:pictureTitle", checkAccessToken, cValidators.validateCommentId, controller.removeComment);

router.post("/likes/:albumName/:pictureTitle", checkAccessToken, cValidators.validateCommentId, likesController.addLikes);

router.delete("/likes/:albumName/:pictureTitle", checkAccessToken, cValidators.validateCommentId, likesController.removeLikes );


export default router;
