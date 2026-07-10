// ============================================================
//  NEXUS — Auth Controller
//  Handles: register, login, token refresh, me (profile fetch)
// ============================================================

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '../config/database';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwtUtils';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { AppError } from '../middlewares/errorMiddleware';

// ── Validation Schemas ────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name cannot exceed 100 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ── Controllers ───────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 * Creates a new User + Profile in a single transaction.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password, username, displayName } = registerSchema.parse(req.body);

    // Hash password with cost factor 12
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            username,
            displayName,
          },
        },
      },
      include: {
        profile: { select: { id: true, username: true } },
      },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      profileId: user.profile!.id,
      subscriptionTier: user.subscriptionTier,
    });
    const refreshToken = signRefreshToken(user.id);

    sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
          profile: user.profile,
        },
      },
      'Account created successfully.',
      201,
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/login
 * Verifies credentials and returns JWT tokens.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: { select: { id: true, username: true } } },
    });

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      profileId: user.profile!.id,
      subscriptionTier: user.subscriptionTier,
    });
    const refreshToken = signRefreshToken(user.id);

    sendSuccess(res, {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/refresh
 * Issues a new access token using a valid refresh token.
 */
export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      throw new AppError('Refresh token is required.', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: { select: { id: true } } },
    });

    if (!user || !user.profile) {
      throw new AppError('User not found.', 404);
    }

    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      profileId: user.profile.id,
      subscriptionTier: user.subscriptionTier,
    });

    sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed successfully.');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/me
 * Returns the authenticated user's account and profile info.
 */
export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId } = req.user!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            phone: true,
            email: true,
            company: true,
            jobTitle: true,
            website: true,
            profilePicture: true,
            companyLogo: true,
            status: true,
            tapCount: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}
