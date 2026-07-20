import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

export function requireTrustedOrigin(req, _res, next) {
  const origin = req.get('origin');
  if (!origin) return next();
  if (!env.frontendOrigins.includes(origin)) {
    return next(new HttpError(403, 'Origen no autorizado.', 'UNTRUSTED_ORIGIN'));
  }
  return next();
}
