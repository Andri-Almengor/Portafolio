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

  let result;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    result = await response.json();
  } catch {
    throw new HttpError(502, 'No fue posible validar la verificación anti-bots.', 'TURNSTILE_UNAVAILABLE');
  }

  if (!result.success) {
    const errorCodes = Array.isArray(result['error-codes']) ? result['error-codes'] : [];
    const isExpired = errorCodes.includes('timeout-or-duplicate');
    const isSecretInvalid = errorCodes.includes('invalid-input-secret') || errorCodes.includes('missing-input-secret');

    if (isExpired) {
      throw new HttpError(
        400,
        'La verificación anti-bots venció o ya fue utilizada. Complete la verificación nuevamente.',
        'TURNSTILE_EXPIRED',
        { errorCodes }
      );
    }

    if (isSecretInvalid) {
      throw new HttpError(
        503,
        'La clave privada de Turnstile no es válida o no está configurada correctamente.',
        'TURNSTILE_SECRET_INVALID',
        { errorCodes }
      );
    }

    throw new HttpError(
      400,
      'La verificación anti-bots falló.',
      'TURNSTILE_FAILED',
      { errorCodes }
    );
  }

  return true;
}
