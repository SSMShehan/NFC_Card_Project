// ============================================================
//  NEXUS — Prisma Client Singleton
//  Prevents multiple client instances in development hot-reload.
// ============================================================

import { PrismaClient } from '@prisma/client';

// Extend the global object to cache the Prisma instance
declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

/**
 * Returns a singleton PrismaClient instance.
 * In development, the instance is cached on the global object to survive
 * hot-module-replacement without exhausting connection pool limits.
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  });
}

export const prisma: PrismaClient =
  process.env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (global.__prismaClient ??= createPrismaClient());
