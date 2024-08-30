import express from 'express';
import { getChatToken, initializeChat } from '../controllers/chatControler';
import { authenticatejwt } from './middlewares/authMiddleware';


const router = express.Router();

router.post('/initialize', authenticatejwt, initializeChat);
router.get('/token', authenticatejwt, getChatToken);

export { router as chatRouter };