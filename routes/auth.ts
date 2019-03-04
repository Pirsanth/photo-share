import express from "express";
const router = express.Router();
import controller from "../controllers/auth";
import { checkToken } from "../middlewares/auth";
import { upload } from "../middlewares/multerSetup";
import { makeUserAvatar } from "../middlewares/photos";


// TODO: Implement signOut
router.post("/signUp", upload.single("profilePicture"), makeUserAvatar, controller.signUp);

router.post("/signIn", controller.signIn);

router.get("/test", checkToken, (req, res) =>{
    res.send("You have reached the secret page");
})

export default router;
