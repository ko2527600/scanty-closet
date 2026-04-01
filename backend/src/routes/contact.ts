import { Router } from 'express';
import { createMessage, getMessages, updateMessageStatus } from '../controllers/contact.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public: Send a message
router.post('/', createMessage);

// Admin: Manage messages
router.get('/admin', authenticate, authorize(['ADMIN']), getMessages);
router.patch('/admin/:id', authenticate, authorize(['ADMIN']), updateMessageStatus);

export default router;
