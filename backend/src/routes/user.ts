import { Router } from 'express';
import { getProfile, updateProfile, getUsers } from '../controllers/user.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Protected user routes
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

// Admin-only user routes
router.get('/', authenticate, authorize(['ADMIN']), getUsers);

export default router;
