import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';
import { authService } from '../services/auth-service.js';
import { asyncRoute } from '../utils/async-route.js';
import { HttpError } from '../utils/http-error.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/schemas.js';
import { requireTrustedOrigin } from '../middleware/origin-guard.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Demasiados intentos. Intente más tarde.' } }
});

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    path: '/api/auth',
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {})
  };
}

function setRefreshCookie(res, token) {
  res.cookie(env.REFRESH_COOKIE_NAME, token, cookieOptions());
}

function clearRefreshCookie(res) {
  const options = cookieOptions();
  delete options.maxAge;
  res.clearCookie(env.REFRESH_COOKIE_NAME, options);
}

authRouter.post(
  '/login',
  requireTrustedOrigin,
  loginLimiter,
  validate(loginSchema),
  asyncRoute(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password);
    setRefreshCookie(res, result.refreshToken);
    res.set('Cache-Control', 'no-store');
    res.json({ admin: result.admin, accessToken: result.accessToken });
  })
);

authRouter.post(
  '/refresh',
  requireTrustedOrigin,
  asyncRoute(async (req, res) => {
    const token = req.cookies[env.REFRESH_COOKIE_NAME];
    if (!token) throw new HttpError(401, 'No existe una sesión activa.', 'NO_SESSION');
    const result = await authService.refresh(token);
    setRefreshCookie(res, result.refreshToken);
    res.set('Cache-Control', 'no-store');
    res.json({ admin: result.admin, accessToken: result.accessToken });
  })
);

authRouter.post(
  '/logout',
  requireTrustedOrigin,
  asyncRoute(async (req, res) => {
    const token = req.cookies[env.REFRESH_COOKIE_NAME];
    await authService.logout(token);
    clearRefreshCookie(res);
    res.status(204).end();
  })
);
