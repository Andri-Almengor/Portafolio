import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { authRouter } from './routes/auth-routes.js';
import { publicRouter } from './routes/public-routes.js';
import { contactRouter } from './routes/contact-routes.js';
import { adminRouter } from './routes/admin-routes.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { HttpError } from './utils/http-error.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const clientDist = resolve(currentDirectory, '../../client/dist');

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const requestId = req.headers['x-request-id'] || randomUUID();
      res.setHeader('X-Request-Id', requestId);
      return requestId;
    }
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'same-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://challenges.cloudflare.com'],
        frameSrc: ['https://challenges.cloudflare.com'],
        connectSrc: ["'self'", 'https://challenges.cloudflare.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    }
  })
);
app.use(compression());
app.use(hpp());
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || env.frontendOrigins.includes(origin)) return callback(null, true);
      return callback(new HttpError(403, 'Origen no autorizado.', 'CORS_REJECTED'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id']
  })
);
app.use(express.json({ limit: '100kb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/public', publicRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

if (env.isProduction) {
  app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(resolve(clientDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);
