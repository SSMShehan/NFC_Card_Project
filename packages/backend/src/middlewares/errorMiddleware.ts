// ============================================================
//  NEXUS — Centralized Error Middleware
//  Must be the last middleware registered in Express.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/** Custom application error with an HTTP status code */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express error handling middleware.
 * Handles AppError, ZodError (validation), Prisma errors, and unknown errors
 * with appropriate HTTP status codes and clean JSON responses.
 */
export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isDev = process.env.NODE_ENV === 'development';

  // ── Operational App Errors ────────────────────────────────
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(isDev && { stack: error.stack }),
    });
    return;
  }

  // ── Zod Validation Errors ─────────────────────────────────
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
    });
    return;
  }

  // ── Prisma Client Errors ──────────────────────────────────
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        res.status(409).json({
          success: false,
          error: 'A record with that value already exists.',
          field: (error.meta?.target as string[])?.join(', '),
        });
        return;

      case 'P2025':
        // Record not found
        res.status(404).json({
          success: false,
          error: 'The requested record was not found.',
        });
        return;

      default:
        res.status(500).json({
          success: false,
          error: 'A database error occurred.',
          ...(isDev && { code: error.code, meta: error.meta }),
        });
        return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: 'Invalid data provided to the database layer.',
      ...(isDev && { detail: error.message }),
    });
    return;
  }

  // ── Unknown / Unhandled Errors ────────────────────────────
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'An unexpected internal server error occurred.',
    ...(isDev && { detail: String(error) }),
  });
}
