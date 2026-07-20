import multer from 'multer';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { HttpError } from '../utils/http-error.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.path}`, 'NOT_FOUND'));
}

export function errorHandler(error, req, res, _next) {
  let normalized = error;

  if (error instanceof multer.MulterError) {
    normalized = new HttpError(
      error.code === 'LIMIT_FILE_SIZE' ? 413 : 400,
      error.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera el tamaño permitido.' : 'Archivo inválido.',
      error.code
    );
  } else if (error instanceof ZodError) {
    normalized = new HttpError(400, 'Datos inválidos.', 'VALIDATION_ERROR', error.flatten());
  }

  const status = normalized.status || 500;
  const requestId = req.id;

  if (status >= 500) {
    logger.error({ err: error, requestId }, 'Error interno no controlado');
  } else {
    logger.warn({ err: normalized, requestId }, 'Solicitud rechazada');
  }

  res.status(status).json({
    error: {
      code: normalized.code || 'INTERNAL_ERROR',
      message: status >= 500 ? 'Ocurrió un error interno.' : normalized.message,
      details: status < 500 ? normalized.details : undefined,
      requestId
    }
  });
}
