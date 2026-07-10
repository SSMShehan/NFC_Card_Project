// ============================================================
//  NEXUS — Auth Routes
// ============================================================

import { Router } from 'express';
import { register, login, refresh, me } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authRouter = Router();

/** POST /api/v1/auth/register */
authRouter.post('/register', register);

/** POST /api/v1/auth/login */
authRouter.post('/login', login);

/** POST /api/v1/auth/refresh */
authRouter.post('/refresh', refresh);

/** GET /api/v1/auth/me — Protected */
authRouter.get('/me', authMiddleware, me);
