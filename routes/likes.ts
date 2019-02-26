import express from "express";
const router = express.Router();
import controller from "../controllers/likes";


router.post("/:albumName/:pictureTitle", controller.addLikes );

router.put("/:albumName/:pictureTitle", controller.editLikes );

router.delete("/:albumName/:pictureTitle", controller.removeLikes );

export default router;
