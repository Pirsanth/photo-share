import express from "express";
const router = express.Router();
import controller from "../controllers/auth";
import { checkToken } from "../middlewares/auth";

// TODO: Implement signOut
router.post("/signUp", controller.signUp);

router.post("/signIn", controller.signIn);

router.get("/test", checkToken, (req, res) =>{
    res.send("You have reached the secret page");
})

export default router;
