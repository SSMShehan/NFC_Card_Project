// ============================================================
//  TAGIT — Admin Authorization Middleware
//  Verifies that the authenticated user possesses ADMIN or SUPER_ADMIN role.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHelper';
import { authMiddleware } from './authMiddleware';

/**
 * Middleware that verifies both JWT authentication and Admin role.
 * Wraps `authMiddleware` and checks `req.user.role`.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await authMiddleware(req, res, () => {
    if (!req.user) {
      sendError(res, 'Authentication required for admin access.', 401);
      return;
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      sendError(
        res,
        'Access denied. Administrator privileges required.',
        403,
      );
      return;
    }

    next();
  });
}
