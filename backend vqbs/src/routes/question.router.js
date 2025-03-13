
import express from 'express';
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  uploadImage,
  bulkUpdateQuestions, 
} from '../controllers/question.controller.js';
import multer from 'multer';
import path from 'path';
import { verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/questions/');
  },
  filename: function (req, file, cb) {
   
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });




router.route("/get").get(getQuestions);


router.route("/add").post(verifyJWT, addQuestion);

router.route("/edit").put(verifyJWT, updateQuestion);

router.route("/delete").delete(verifyJWT, deleteQuestion);

router.route("/bulk-update").put(verifyJWT, bulkUpdateQuestions);

router.route("/upload-image").post(verifyJWT, upload.array('images', 5), uploadImage);
export default router;









