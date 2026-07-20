import multer from 'multer';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadProjectImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_IMAGE_SIZE_MB * 1024 * 1024,
    files: 1,
    fields: 5
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new HttpError(400, 'Solo se permiten imágenes JPG, PNG o WEBP.', 'INVALID_IMAGE_TYPE'));
    }
    return callback(null, true);
  }
}).single('image');
