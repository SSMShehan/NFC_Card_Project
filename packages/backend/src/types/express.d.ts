// ============================================================
//  NEXUS — Express Type Augmentation
//  Adds typed `user` property to the Express Request object,
//  populated by the authMiddleware after JWT verification.
// ============================================================

import { SubscriptionTier, UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user's identity, set by authMiddleware.
       * Only present on protected routes.
       */
      user?: {
        userId: string;
        email: string;
        profileId: string;
        role?: UserRole;
        subscriptionTier: SubscriptionTier;
      };
    }
  }
}

export {};
