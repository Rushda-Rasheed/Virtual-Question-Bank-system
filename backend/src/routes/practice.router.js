
import { Router } from 'express';
import { getFilteredQuestions, startExam } from '../controllers/practice.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/questions', getFilteredQuestions);
router.post('/start-exam', verifyJWT, startExam);

export default router;
