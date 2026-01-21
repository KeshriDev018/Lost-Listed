import express from "express"
import { changePassword, getUserProfile, loginUser, logoutUser, registerUser, updateUserAvatar, updateUserInfo } from "../controllers/user.controller.js"
import { singleUpload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/Authentication.js";

const router =express.Router();

router.route("/register").post(singleUpload,registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/getProfile").get(verifyJWT,getUserProfile);
router.route("/update-profile").put(verifyJWT,updateUserInfo)
router.route("/update-avatar").put(verifyJWT,singleUpload,updateUserAvatar)
router.route("/update-password").put(verifyJWT,changePassword)







export default router;