import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../validators/schemas.js';
import { asyncRoute } from '../utils/async-route.js';
import { contactService } from '../services/contact-service.js';
import { verifyTurnstile } from '../services/turnstile-service.js';

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Ha enviado demasiados mensajes. Intente más tarde.' } }
});

contactRouter.post(
  '/',
  contactLimiter,
  validate(contactSchema),
  asyncRoute(async (req, res) => {
    await verifyTurnstile(req.body.turnstileToken, req.ip);
    const result = await contactService.create(req.body, req.ip);
    res.status(201).json({
      message: result.channel === 'email'
        ? 'Mensaje enviado correctamente.'
        : 'Mensaje preparado para WhatsApp.',
      ...result
    });
  })
);
