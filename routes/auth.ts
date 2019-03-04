import express from "express";
const router = express.Router();
import controller from "../controllers/auth";
import { checkAccessToken } from "../middlewares/auth";
import { upload } from "../middlewares/multerSetup";
import { makeUserAvatar } from "../middlewares/photos";


// TODO: Implement signOut
router.post("/signUp", upload.single("profilePicture"), makeUserAvatar, controller.signUp);

router.post("/signIn", controller.signIn);

router.post("/refresh", controller.handleRefreshRoute);

router.post("/logout", controller.handleLogout);

router.get("/test", checkAccessToken, (req, res) =>{
    res.send("You have reached the secret page");
})

export default router;
