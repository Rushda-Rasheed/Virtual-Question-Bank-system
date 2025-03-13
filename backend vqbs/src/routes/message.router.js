
import { Router } from 'express';
import { sendMessage, replyToMessage, getMessages } from '../controllers/message.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/send-message', verifyJWT, sendMessage);

router.post('/reply-message', verifyJWT, replyToMessage);

router.get('/messages', verifyJWT, getMessages);

export default router;
