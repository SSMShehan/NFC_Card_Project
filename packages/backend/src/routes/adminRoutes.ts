// ============================================================
//  TAGIT — Admin Routes
//  Protected by authMiddleware AND requireAdmin middleware.
// ============================================================

import { Router } from 'express';
import { getAdminStats, getAdminUsers, updateUserRoleOrTier } from '../controllers/adminController';
import { authMiddleware, requireAdmin } from '../middlewares/authMiddleware';

export const adminRouter = Router();

// Apply auth and admin requirements to all admin routes
adminRouter.use(authMiddleware, requireAdmin);

/** GET /api/v1/admin/stats — System Overview */
adminRouter.get('/stats', getAdminStats);

/** GET /api/v1/admin/users — List All Platform Users */
adminRouter.get('/users', getAdminUsers);

/** PATCH /api/v1/admin/users/:id/role — Update User Role / Tier */
adminRouter.patch('/users/:id/role', updateUserRoleOrTier);
