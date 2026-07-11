// ============================================================
//  NEXUS — Authentication Middleware
//  Verifies the JWT Bearer token on all protected routes.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwtUtils';
import { prisma } from '../config/database';
import { sendError } from '../utils/responseHelper';

/**
 * Extracts and verifies the JWT from the Authorization header.
 * On success, populates `req.user` with the decoded payload.
 * On failure, responds immediately with 401 Unauthorized.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authorization header missing or malformed. Expected: Bearer <token>', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    sendError(res, 'Bearer token is empty', 401);
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    // Lightweight DB check: ensure the user still exists and is not suspended
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionTier: true,
        profile: { select: { id: true } },
      },
    });

    if (!user) {
      sendError(res, 'User account not found. Token may be stale.', 401);
      return;
    }

    if (!user.profile) {
      sendError(res, 'No profile associated with this account.', 403);
      return;
    }

    // Attach typed user identity to the request
    req.user = {
      userId: user.id,
      email: user.email,
      profileId: user.profile.id,
      role: user.role || decoded.role || 'USER',
      subscriptionTier: user.subscriptionTier,
    };

    next();
  } catch (error) {
    const err = error as Error;
    if (err.name === 'TokenExpiredError') {
      sendError(res, 'Access token has expired. Please refresh your session.', 401);
    } else if (err.name === 'JsonWebTokenError') {
      sendError(res, 'Invalid access token.', 401);
    } else {
      sendError(res, 'Authentication failed due to an internal error.', 500);
    }
  }
}

/**
 * Middleware that ensures the authenticated user is an ADMIN.
 * Must be placed after `authMiddleware` in the route chain.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    sendError(res, 'Administrator privileges required to access this resource.', 403);
    return;
  }
  next();
}
