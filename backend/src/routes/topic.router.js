
import express from 'express';
import { getTopics, addTopic, updateTopic, deleteTopic } from '../controllers/topic.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
const router = express.Router();

router.route("/get").get(getTopics);

router.route("/add").post(verifyJWT, addTopic);

router.route("/edit").put(verifyJWT, updateTopic);

router.route("/delete").delete(verifyJWT, deleteTopic);
export default router;
