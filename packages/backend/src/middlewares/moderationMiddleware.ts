// ============================================================
//  NEXUS — AI Image Moderation Middleware
//  Pipeline: Multer upload → this middleware → controller
//
//  Architecture:
//  - If AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY are set,
//    uses real AWS Rekognition DetectModerationLabels API.
//  - Otherwise, falls back to a deterministic mockup that
//    simulates moderation for development/staging.
//
//  On detection of explicit/inappropriate content:
//  → Sets req.moderationResult = { isSafe: false, ... }
//  → Controller is responsible for creating the REJECTED
//    VerificationRequest and returning a 403 response.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  ModerationLabel,
} from '@aws-sdk/client-rekognition';
import fs from 'fs';
import path from 'path';

/** Result shape attached to req by this middleware */
export interface ModerationResult {
  isSafe: boolean;
  confidence: number;
  detectedLabels: string[];
  provider: 'aws-rekognition' | 'mockup';
}

// Extend Express Request to carry moderation result
declare global {
  namespace Express {
    interface Request {
      moderationResult?: ModerationResult;
    }
  }
}

// Categories that Rekognition flags as explicit/inappropriate
const FLAGGED_CATEGORIES = [
  'Explicit Nudity',
  'Nudity',
  'Graphic Violence',
  'Violence',
  'Visually Disturbing',
  'Hate Symbols',
  'Drugs & Tobacco',
  'Rude Gestures',
];

const MIN_CONFIDENCE = Number(process.env.AWS_REKOGNITION_MIN_CONFIDENCE ?? 75);

// ── AWS Rekognition Client (lazy initialised) ─────────────────
let rekognitionClient: RekognitionClient | null = null;

function getAWSClient(): RekognitionClient | null {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null;
  }
  if (!rekognitionClient) {
    rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return rekognitionClient;
}

// ── Real AWS Rekognition Moderation ───────────────────────────
async function analyzeWithRekognition(
  imageBuffer: Buffer,
): Promise<ModerationResult> {
  const client = getAWSClient()!;

  const command = new DetectModerationLabelsCommand({
    Image: { Bytes: imageBuffer },
    MinConfidence: MIN_CONFIDENCE,
  });

  const response = await client.send(command);
  const labels: ModerationLabel[] = response.ModerationLabels ?? [];

  const flaggedLabels = labels
    .filter(
      (label) =>
        label.Name !== undefined &&
        FLAGGED_CATEGORIES.some(
          (cat) =>
            label.Name?.toLowerCase().includes(cat.toLowerCase()) ||
            label.ParentName?.toLowerCase().includes(cat.toLowerCase()),
        ),
    )
    .map((l) => l.Name ?? 'Unknown');

  const maxConfidence = labels.length > 0
    ? Math.max(...labels.map((l) => l.Confidence ?? 0))
    : 0;

  return {
    isSafe: flaggedLabels.length === 0,
    confidence: maxConfidence,
    detectedLabels: flaggedLabels,
    provider: 'aws-rekognition',
  };
}

// ── Mockup Moderation (Development Fallback) ──────────────────
/**
 * Deterministic mockup moderation for local development.
 * Files named "flag_*" or "explicit_*" will be flagged as unsafe.
 * All other files pass.
 */
async function analyzeWithMockup(
  filename: string,
): Promise<ModerationResult> {
  // Simulate async latency (200-500ms)
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 300 + 200)),
  );

  const baseName = path.basename(filename).toLowerCase();
  const isSafe = !baseName.startsWith('flag_') && !baseName.startsWith('explicit_');

  return {
    isSafe,
    confidence: isSafe ? 0 : 94.2,
    detectedLabels: isSafe ? [] : ['Explicit Nudity [MOCKUP]'],
    provider: 'mockup',
  };
}

// ── Middleware Factory ────────────────────────────────────────
/**
 * Express middleware that runs image moderation on an uploaded file.
 * Must be placed AFTER multer upload middleware.
 *
 * @param imageFieldName - The multer field name holding the uploaded image
 *
 * Usage:
 *   router.post('/upload', uploadSingle, moderationMiddleware('image'), controller)
 */
export function moderationMiddleware(imageFieldName: string = 'image') {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Retrieve the uploaded file from multer
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const singleFile = req.file;

    let uploadedFile: Express.Multer.File | undefined;

    if (singleFile) {
      uploadedFile = singleFile;
    } else if (files && files[imageFieldName]?.[0]) {
      uploadedFile = files[imageFieldName][0];
    }

    // If no image was uploaded, skip moderation
    if (!uploadedFile) {
      next();
      return;
    }

    try {
      const client = getAWSClient();
      let result: ModerationResult;

      if (client) {
        // Production path — use real AWS Rekognition
        const imageBuffer = fs.readFileSync(uploadedFile.path);
        result = await analyzeWithRekognition(imageBuffer);
        console.log(`🔍 [Rekognition] ${uploadedFile.filename}: safe=${result.isSafe}`);
      } else {
        // Development path — use deterministic mockup
        result = await analyzeWithMockup(uploadedFile.originalname);
        console.log(
          `🔍 [Moderation Mockup] ${uploadedFile.filename}: safe=${result.isSafe}`,
        );
      }

      // Attach the result for the controller to consume
      req.moderationResult = result;

      if (!result.isSafe) {
        // Delete the flagged file from disk immediately
        fs.unlink(uploadedFile.path, (err) => {
          if (err) console.warn('⚠️ Failed to delete flagged file:', err.message);
        });
      }

      next();
    } catch (error) {
      console.error('❌ Moderation pipeline error:', error);
      // On moderation error, err on the side of caution — reject the upload
      req.moderationResult = {
        isSafe: false,
        confidence: 0,
        detectedLabels: ['Moderation service unavailable'],
        provider: 'mockup',
      };
      next();
    }
  };
}
