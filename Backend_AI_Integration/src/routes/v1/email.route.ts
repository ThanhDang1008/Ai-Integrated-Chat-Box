import express from 'express';
import * as Email_Controller from '@/controllers/email.controller';
import { limiterSendMail } from '@/shared/middleware/ratelimit.config';

const router = express.Router();


router.post('/send',limiterSendMail, Email_Controller.sendEmail)
router.get('/verify', Email_Controller.verifyEmail)

export default router;