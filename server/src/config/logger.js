import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      '*.token',
      '*.refreshToken',
      'GOOGLE_SERVICE_ACCOUNT_JSON_BASE64'
    ],
    censor: '[REDACTED]'
  }
});
