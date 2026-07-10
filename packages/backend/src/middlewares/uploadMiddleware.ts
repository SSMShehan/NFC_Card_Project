// ============================================================
//  NEXUS — Multer Upload Middleware
//  Configures file upload handling with size and type validation.
// ============================================================

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import fs from 'fs';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = Number(process.env.MAX_FILE_SIZE_BYTES ?? 5_242_880); // 5MB default
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads';

// Ensure the upload directory exists
const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/**
 * Disk storage engine — saves files with UUID-based names.
 * In production, replace this with a Supabase Storage or S3 upload strategy.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

/**
 * MIME type allowlist — rejects non-image uploads before they hit the disk.
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      ),
    );
  }
};

/** Multer instance for single image uploads */
export const uploadSingle = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
}).single('image');

/** Multer instance for multiple image fields (profilePicture + companyLogo) */
export const uploadFields = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 },
]);
