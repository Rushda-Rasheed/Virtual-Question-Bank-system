import { Router } from "express";
import { getUsers, createUser, updateUser, deleteUser , updateProfile,fetchUserDetails} from "../controllers/addusers.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get").get(getUsers);

router.route("/post").post(verifyJWT, createUser);

router.route("/put").put(verifyJWT, updateUser);

router.route("/putprofile").put(verifyJWT, updateProfile);

router.route("/getuser").get(verifyJWT,fetchUserDetails);

router.route("/delete").delete(verifyJWT, deleteUser);

export default router;

  