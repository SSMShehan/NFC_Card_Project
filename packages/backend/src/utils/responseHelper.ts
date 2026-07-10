// ============================================================
//  NEXUS — Standardised API Response Helper
//  Ensures all API responses share a consistent JSON envelope.
// ============================================================

import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Sends a successful JSON response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: Record<string, unknown>,
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
  res.status(statusCode).json(response);
}

/**
 * Sends an error JSON response.
 */
export function sendError(
  res: Response,
  error: string,
  statusCode: number = 500,
): void {
  const response: ApiResponse = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
}
