import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { sheetsRepository } from './sheets-repository.js';
import { appsScriptService } from './apps-script-service.js';
import { hmacSha256 } from '../utils/security.js';

class ContactService {
  async create(data, ipAddress) {
    const contact = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      channel: data.channel,
      status: 'new',
      createdAt: new Date().toISOString(),
      ipHash: hmacSha256(ipAddress || 'unknown', env.IP_HASH_SALT)
    };

    await sheetsRepository.append('contacts', contact);

    if (data.channel === 'email') {
      try {
        await appsScriptService.sendContactEmail(contact);
      } catch (error) {
        // La solicitud no debe quedar registrada como exitosa cuando el correo no pudo enviarse.
        // Eliminar la fila permite al usuario reintentar sin crear contactos duplicados.
        await sheetsRepository.deleteById('contacts', contact.id).catch(() => {});
        throw error;
      }
      return { contactId: contact.id, channel: 'email' };
    }

    const text = [
      `Hola Andrick, mi nombre es ${contact.name}.`,
      `Asunto: ${contact.subject}`,
      contact.message,
      `Correo: ${contact.email}`,
      contact.phone ? `Teléfono: ${contact.phone}` : ''
    ].filter(Boolean).join('\n\n');

    return {
      contactId: contact.id,
      channel: 'whatsapp',
      whatsappUrl: `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    };
  }
}

export const contactService = new ContactService();