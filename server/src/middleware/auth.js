import { authService } from '../services/auth-service.js';
import { HttpError } from '../utils/http-error.js';

export function requireAdmin(req, _res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Se requiere autenticación.', 'AUTH_REQUIRED'));
  }

  try {
    req.admin = authService.verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
}
