import 'dotenv/config';
import { z } from 'zod';

const optionalString = z.string().trim().optional().default('');
const appsScriptUrl = z
  .union([
    z.literal(''),
    z.string().trim().url().refine(
      (value) => /\/exec(?:\?|$)/.test(value),
      'Debe utilizar la URL pública de la implementación terminada en /exec, no la URL /dev.'
    )
  ])
  .default('');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  FRONTEND_ORIGINS: z.string().default('http://localhost:5173'),
  PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
  GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: optionalString,
  GOOGLE_SPREADSHEET_ID: optionalString,
  GOOGLE_DRIVE_FOLDER_ID: optionalString,
  APPS_SCRIPT_CONTACT_URL: appsScriptUrl,
  CONTACT_HMAC_SECRET: z.string().min(32),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  REFRESH_COOKIE_NAME: z.string().default('portfolio_refresh'),
  COOKIE_DOMAIN: optionalString,
  IP_HASH_SALT: z.string().min(32),
  WHATSAPP_NUMBER: z.string().regex(/^\d{8,15}$/).default('50671390044'),
  TURNSTILE_SECRET_KEY: optionalString,
  MAX_IMAGE_SIZE_MB: z.coerce.number().min(1).max(10).default(5),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional(),
  ADMIN_BOOTSTRAP_NAME: z.string().trim().min(2).optional(),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(12).optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Variables de entorno inválidas:\n${details}`);
}

const values = parsed.data;

function normalizeOrigin(origin) {
  return origin.trim().replace(/\/+$/, '');
}

export const env = Object.freeze({
  ...values,
  frontendOrigins: values.FRONTEND_ORIGINS.split(',')
    .map(normalizeOrigin)
    .filter(Boolean),
  isProduction: values.NODE_ENV === 'production'
});
