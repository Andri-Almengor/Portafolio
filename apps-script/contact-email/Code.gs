var CONTACT_SCRIPT_VERSION = '2026.07.21.1';

/**
 * Propiedades obligatorias del script:
 * CONTACT_RECIPIENT_EMAIL
 * CONTACT_HMAC_SECRET
 */
function doGet() {
  return jsonResponse({
    ok: true,
    service: 'portfolio-contact-email',
    version: CONTACT_SCRIPT_VERSION
  });
}

function doPost(e) {
  var diagnosticId = Utilities.getUuid();

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw contactError_('EMPTY_BODY', 'Cuerpo vacío.');
    }

    var request;
    try {
      request = JSON.parse(e.postData.contents);
    } catch (_error) {
      throw contactError_('INVALID_JSON', 'El cuerpo no contiene JSON válido.');
    }

    var timestamp = String(request.timestamp || '');
    var payloadText = String(request.payload || '');
    var signature = String(request.signature || '').toLowerCase();

    if (!/^\d{13}$/.test(timestamp) || !payloadText || !/^[a-f0-9]{64}$/.test(signature)) {
      throw contactError_('INVALID_REQUEST', 'Solicitud inválida.');
    }

    if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) {
      throw contactError_('REQUEST_EXPIRED', 'Solicitud expirada.');
    }

    var properties = PropertiesService.getScriptProperties();
    var secret = String(properties.getProperty('CONTACT_HMAC_SECRET') || '').trim();
    var recipient = String(properties.getProperty('CONTACT_RECIPIENT_EMAIL') || '').trim();

    if (secret.length < 32) {
      throw contactError_('CONFIG_MISSING_SECRET', 'CONTACT_HMAC_SECRET no está configurado correctamente.');
    }

    if (!recipient) {
      throw contactError_('CONFIG_MISSING_RECIPIENT', 'CONTACT_RECIPIENT_EMAIL no está configurado.');
    }

    var expected = bytesToHex(
      Utilities.computeHmacSha256Signature(
        timestamp + '.' + payloadText,
        secret,
        Utilities.Charset.UTF_8
      )
    );

    if (!constantTimeEqual(expected, signature)) {
      throw contactError_('INVALID_SIGNATURE', 'La firma HMAC no coincide.');
    }

    var contact;
    try {
      contact = JSON.parse(payloadText);
    } catch (_payloadError) {
      throw contactError_('INVALID_PAYLOAD_JSON', 'El payload no contiene JSON válido.');
    }

    validateContact(contact);

    var safeSubject = String(contact.subject).replace(/[\r\n]+/g, ' ').slice(0, 150);
    var plainBody = [
      'Nuevo mensaje desde el portafolio',
      '',
      'Nombre: ' + contact.name,
      'Correo: ' + contact.email,
      'Teléfono: ' + (contact.phone || 'No indicado'),
      'Asunto: ' + safeSubject,
      'Fecha: ' + contact.createdAt,
      '',
      'Mensaje:',
      contact.message,
      '',
      'ID: ' + contact.id
    ].join('\n');

    var htmlBody = [
      '<h2>Nuevo mensaje desde el portafolio</h2>',
      '<p><strong>Nombre:</strong> ' + escapeHtml(contact.name) + '</p>',
      '<p><strong>Correo:</strong> ' + escapeHtml(contact.email) + '</p>',
      '<p><strong>Teléfono:</strong> ' + escapeHtml(contact.phone || 'No indicado') + '</p>',
      '<p><strong>Asunto:</strong> ' + escapeHtml(safeSubject) + '</p>',
      '<p><strong>Fecha:</strong> ' + escapeHtml(contact.createdAt) + '</p>',
      '<p><strong>Mensaje:</strong></p>',
      '<p>' + escapeHtml(contact.message).replace(/\n/g, '<br>') + '</p>',
      '<hr>',
      '<small>ID: ' + escapeHtml(contact.id) + '</small>'
    ].join('');

    try {
      MailApp.sendEmail({
        to: recipient,
        replyTo: contact.email,
        subject: '[Portafolio] ' + safeSubject,
        body: plainBody,
        htmlBody: htmlBody,
        name: 'Portafolio de Andrick'
      });
    } catch (mailError) {
      console.error(JSON.stringify({
        diagnosticId: diagnosticId,
        code: 'MAIL_SEND_FAILED',
        message: String(mailError && mailError.message ? mailError.message : mailError)
      }));
      throw contactError_('MAIL_SEND_FAILED', 'Google no permitió enviar el correo.');
    }

    return jsonResponse({
      ok: true,
      version: CONTACT_SCRIPT_VERSION,
      diagnosticId: diagnosticId
    });
  } catch (error) {
    var code = error && error.contactCode ? error.contactCode : 'INTERNAL_ERROR';
    var safeMessage = contactPublicMessage_(code);

    console.error(JSON.stringify({
      diagnosticId: diagnosticId,
      code: code,
      message: String(error && error.message ? error.message : error)
    }));

    return jsonResponse({
      ok: false,
      code: code,
      error: safeMessage,
      version: CONTACT_SCRIPT_VERSION,
      diagnosticId: diagnosticId
    });
  }
}

/**
 * Ejecute esta función manualmente desde el editor de Apps Script.
 * No muestra el secreto; solo confirma si la configuración existe.
 */
function getContactConfigurationStatus() {
  var properties = PropertiesService.getScriptProperties();
  var secret = String(properties.getProperty('CONTACT_HMAC_SECRET') || '').trim();
  var recipient = String(properties.getProperty('CONTACT_RECIPIENT_EMAIL') || '').trim();
  var status = {
    version: CONTACT_SCRIPT_VERSION,
    recipientConfigured: Boolean(recipient),
    recipientMasked: maskEmail_(recipient),
    secretConfigured: secret.length >= 32,
    secretLength: secret.length,
    remainingDailyQuota: MailApp.getRemainingDailyQuota()
  };

  console.log(JSON.stringify(status, null, 2));
  return status;
}

/**
 * Ejecute esta función manualmente para validar permisos y MailApp.
 * Envía un único correo de prueba al destinatario configurado.
 */
function testContactEmailConfiguration() {
  var properties = PropertiesService.getScriptProperties();
  var recipient = String(properties.getProperty('CONTACT_RECIPIENT_EMAIL') || '').trim();

  if (!recipient) {
    throw new Error('CONTACT_RECIPIENT_EMAIL no está configurado.');
  }

  MailApp.sendEmail({
    to: recipient,
    subject: '[Portafolio] Prueba de configuración',
    body: 'Apps Script puede enviar correos correctamente. Versión: ' + CONTACT_SCRIPT_VERSION,
    name: 'Portafolio de Andrick'
  });

  console.log('Correo de prueba enviado a ' + maskEmail_(recipient));
}

function validateContact(contact) {
  if (!contact || typeof contact !== 'object') {
    throw contactError_('INVALID_PAYLOAD', 'Payload inválido.');
  }

  if (!contact.id || !contact.name || !contact.email || !contact.subject || !contact.message) {
    throw contactError_('MISSING_FIELDS', 'Faltan campos obligatorios.');
  }

  if (String(contact.name).length > 100 || String(contact.message).length > 3000) {
    throw contactError_('FIELD_TOO_LONG', 'Uno o más campos superan el límite permitido.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact.email))) {
    throw contactError_('INVALID_EMAIL', 'Correo inválido.');
  }
}

function contactError_(code, message) {
  var error = new Error(message);
  error.contactCode = code;
  return error;
}

function contactPublicMessage_(code) {
  var messages = {
    EMPTY_BODY: 'La solicitud llegó vacía.',
    INVALID_JSON: 'La solicitud no contiene JSON válido.',
    INVALID_REQUEST: 'La solicitud firmada es inválida.',
    REQUEST_EXPIRED: 'La solicitud firmada expiró.',
    CONFIG_MISSING_SECRET: 'El secreto HMAC de Apps Script no está configurado.',
    CONFIG_MISSING_RECIPIENT: 'El correo destinatario de Apps Script no está configurado.',
    INVALID_SIGNATURE: 'El secreto HMAC del backend no coincide con Apps Script.',
    INVALID_PAYLOAD_JSON: 'El contenido del mensaje no contiene JSON válido.',
    INVALID_PAYLOAD: 'El contenido del mensaje es inválido.',
    MISSING_FIELDS: 'Faltan datos obligatorios del mensaje.',
    FIELD_TOO_LONG: 'Uno o más campos superan el límite permitido.',
    INVALID_EMAIL: 'El correo del remitente no es válido.',
    MAIL_SEND_FAILED: 'Apps Script no pudo enviar el correo mediante MailApp.',
    INTERNAL_ERROR: 'Apps Script encontró un error interno.'
  };

  return messages[code] || messages.INTERNAL_ERROR;
}

function bytesToHex(bytes) {
  return bytes.map(function(byte) {
    var normalized = byte < 0 ? byte + 256 : byte;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  var difference = 0;
  for (var i = 0; i < left.length; i++) {
    difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return difference === 0;
}

function maskEmail_(email) {
  if (!email || email.indexOf('@') < 1) return '';
  var parts = email.split('@');
  var local = parts[0];
  return local.charAt(0) + '***@' + parts.slice(1).join('@');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
