import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function hmacSha256(value, secret) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function parseBoolean(value) {
  return value === true || String(value).toLowerCase() === 'true';
}

export function parseJson(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}
