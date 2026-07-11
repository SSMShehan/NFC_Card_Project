// ============================================================
//  TAGIT — Admin Controller
//  Handles platform-wide stats, user management, and tier/role updates.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/responseHelper';
import { AppError } from '../middlewares/errorMiddleware';

/**
 * GET /api/v1/admin/stats
 * Returns platform overview metrics for the Admin Dashboard.
 */
export async function getAdminStats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const totalProfiles = await prisma.profile.count();
    const activeCards = await prisma.profile.count({ where: { status: 'ACTIVE' } });
    const corporateUsers = await prisma.user.count({ where: { subscriptionTier: 'CORPORATE' } });
    const premiumUsers = await prisma.user.count({ where: { subscriptionTier: 'PREMIUM' } });

    // Aggregate total NFC taps across all profiles
    const tapAggregation = await prisma.profile.aggregate({
      _sum: { tapCount: true },
    });
    const totalTaps = tapAggregation._sum.tapCount || 0;

    sendSuccess(res, {
      totalUsers,
      totalAdmins,
      totalProfiles,
      activeCards,
      corporateUsers,
      premiumUsers,
      totalTaps,
      platformHealth: '100% Operational',
    }, 'Admin metrics retrieved successfully.');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/users
 * Lists all users with their profile and subscription status.
 */
export async function getAdminUsers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        authProvider: true,
        subscriptionTier: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            username: true,
            displayName: true,
            company: true,
            jobTitle: true,
            status: true,
            tapCount: true,
          },
        },
      },
    });

    sendSuccess(res, users, 'Users retrieved successfully.');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/users/:id/role
 * Updates a user's role (USER <-> ADMIN) or subscriptionTier.
 */
export async function updateUserRoleOrTier(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { role, subscriptionTier, profileStatus } = req.body as {
      role?: 'USER' | 'ADMIN';
      subscriptionTier?: 'FREE' | 'PREMIUM' | 'CORPORATE';
      profileStatus?: 'ACTIVE' | 'SUSPENDED' | 'STEALTH';
    };

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!targetUser) {
      throw new AppError('Target user not found.', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role || targetUser.role,
        subscriptionTier: subscriptionTier || targetUser.subscriptionTier,
      },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionTier: true,
      },
    });

    if (profileStatus && targetUser.profile) {
      await prisma.profile.update({
        where: { id: targetUser.profile.id },
        data: { status: profileStatus },
      });
    }

    sendSuccess(res, updatedUser, 'User status updated successfully.');
  } catch (error) {
    next(error);
  }
}
