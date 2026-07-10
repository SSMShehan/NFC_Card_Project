// ============================================================
//  TAGIT — JWT Utility Helpers
// ============================================================

import jwt from 'jsonwebtoken';
import { SubscriptionTier } from '@prisma/client';

/** Shape of data encoded inside each access token */
export interface JwtPayload {
  userId: string;
  email: string;
  profileId: string;
  subscriptionTier: SubscriptionTier;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback-dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';

/**
 * Signs and returns a short-lived JWT access token.
 */
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'tagit-api',
    audience: 'tagit-client',
  } as jwt.SignOptions);
}

/**
 * Signs and returns a long-lived JWT refresh token.
 * The refresh token only contains the userId to minimise exposed data.
 */
export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'tagit-api',
    audience: 'tagit-refresh',
  } as jwt.SignOptions);
}

/**
 * Verifies and decodes a JWT access token.
 * Throws `JsonWebTokenError` or `TokenExpiredError` on failure.
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'tagit-api',
    audience: 'tagit-client',
  }) as JwtPayload;
}

/**
 * Verifies a refresh token and returns the userId.
 */
export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'tagit-api',
    audience: 'tagit-refresh',
  }) as { userId: string };
}
