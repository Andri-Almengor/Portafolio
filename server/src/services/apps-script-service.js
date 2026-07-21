import { env } from '../config/env.js';
import { hmacSha256 } from '../utils/security.js';
import { HttpError } from '../utils/http-error.js';

class AppsScriptService {
  async sendContactEmail(contact) {
    if (!env.APPS_SCRIPT_CONTACT_URL) {
      throw new HttpError(
        503,
        'El envío por correo no está configurado en el servidor.',
        'APPS_SCRIPT_NOT_CONFIGURED'
      );
    }

    const timestamp = Date.now().toString();
    const payload = JSON.stringify({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
      createdAt: contact.createdAt
    });
    const signature = hmacSha256(`${timestamp}.${payload}`, env.CONTACT_HMAC_SECRET);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(env.APPS_SCRIPT_CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, payload, signature }),
        signal: controller.signal,
        redirect: 'follow'
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new HttpError(
          502,
          `Apps Script devolvió contenido no válido con estado ${response.status}. Confirme que la URL configurada termine en /exec.`,
          'APPS_SCRIPT_INVALID_RESPONSE'
        );
      }

      if (!response.ok || result.ok !== true) {
        const providerCode = typeof result.code === 'string' ? result.code : 'UNKNOWN_APPS_SCRIPT_ERROR';
        const detail = typeof result.error === 'string' ? result.error : 'Apps Script rechazó la solicitud.';
        const diagnosticId = typeof result.diagnosticId === 'string' ? result.diagnosticId : undefined;

        throw new HttpError(
          502,
          `No fue posible enviar el correo. ${detail}`,
          providerCode,
          diagnosticId ? { diagnosticId } : undefined
        );
      }

      return result;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (error?.name === 'AbortError') {
        throw new HttpError(504, 'Apps Script tardó demasiado en responder.', 'APPS_SCRIPT_TIMEOUT');
      }
      throw new HttpError(502, 'No fue posible conectar con Apps Script.', 'APPS_SCRIPT_UNAVAILABLE');
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const appsScriptService = new AppsScriptService();
