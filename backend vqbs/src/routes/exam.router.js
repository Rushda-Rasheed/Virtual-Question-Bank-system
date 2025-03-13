
import { Router } from 'express';
import { submitExam , getExamResults ,getAllExamResults } from '../controllers/exam.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/submit-exam',  verifyJWT, submitExam);
router.get('/results', verifyJWT, getExamResults);
router.get('/all-results', verifyJWT, getAllExamResults);

export default router;
