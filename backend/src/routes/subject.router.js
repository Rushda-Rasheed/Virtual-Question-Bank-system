
import express from 'express';
import { getSubjects, addSubject, updateSubject, deleteSubject } from '../controllers/subject.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
const router = express.Router();

router.route("/get").get(getSubjects);

router.route("/add").post(verifyJWT, addSubject);

router.route("/edit").put(verifyJWT, updateSubject);

router.route("/delete").delete(verifyJWT, deleteSubject);
export default router;
