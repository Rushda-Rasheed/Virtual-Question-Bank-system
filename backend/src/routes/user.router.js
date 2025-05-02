import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  refreshAccessToken,
  getUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-profile").put(verifyJWT, updateProfile);
router.route("/profile").get(verifyJWT, getUserDetails);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
