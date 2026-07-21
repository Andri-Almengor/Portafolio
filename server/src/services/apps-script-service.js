import { env } from '../config/env.js';
import { hmacSha256 } from '../utils/security.js';

class AppsScriptService {
  async sendContactEmail(contact) {
    if (!env.APPS_SCRIPT_CONTACT_URL) {
      return { skipped: true, reason: 'APPS_SCRIPT_CONTACT_URL no configurado' };
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
        throw new Error(
          `Apps Script devolvió contenido no válido con estado ${response.status}. ` +
          'Confirme que la URL configurada termine en /exec.'
        );
      }

      if (!response.ok || result.ok !== true) {
        const detail = typeof result.error === 'string' ? ` ${result.error}` : '';
        throw new Error(`Apps Script rechazó el correo con estado ${response.status}.${detail}`);
      }

      return result;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const appsScriptService = new AppsScriptService();