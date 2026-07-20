import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

export async function verifyTurnstile(token, remoteIp) {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) {
    throw new HttpError(400, 'Complete la verificación anti-bots.', 'TURNSTILE_REQUIRED');
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token
  });
  if (remoteIp) body.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const result = await response.json();
  if (!result.success) {
    throw new HttpError(400, 'La verificación anti-bots falló.', 'TURNSTILE_FAILED');
  }
  return true;
}
