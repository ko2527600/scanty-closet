import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getCategories);

// Admin-only routes
router.post('/', authenticate, authorize(['ADMIN']), createCategory);
router.patch('/:id', authenticate, authorize(['ADMIN']), updateCategory);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteCategory);

export default router;
