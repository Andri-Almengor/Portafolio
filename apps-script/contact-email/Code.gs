/**
 * Propiedades obligatorias del script:
 * CONTACT_RECIPIENT_EMAIL
 * CONTACT_HMAC_SECRET
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Cuerpo vacío.');
    }

    var request = JSON.parse(e.postData.contents);
    var timestamp = String(request.timestamp || '');
    var payloadText = String(request.payload || '');
    var signature = String(request.signature || '').toLowerCase();

    if (!/^\d{13}$/.test(timestamp) || !payloadText || !/^[a-f0-9]{64}$/.test(signature)) {
      throw new Error('Solicitud inválida.');
    }

    if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) {
      throw new Error('Solicitud expirada.');
    }

    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty('CONTACT_HMAC_SECRET');
    var recipient = properties.getProperty('CONTACT_RECIPIENT_EMAIL');
    if (!secret || secret.length < 32 || !recipient) {
      throw new Error('El Apps Script no está configurado.');
    }

    var expected = bytesToHex(
      Utilities.computeHmacSha256Signature(
        timestamp + '.' + payloadText,
        secret,
        Utilities.Charset.UTF_8
      )
    );

    if (!constantTimeEqual(expected, signature)) {
      throw new Error('Firma inválida.');
    }

    var contact = JSON.parse(payloadText);
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

    MailApp.sendEmail({
      to: recipient,
      replyTo: contact.email,
      subject: '[Portafolio] ' + safeSubject,
      body: plainBody,
      htmlBody: htmlBody,
      name: 'Portafolio de Andrick'
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: 'No fue posible procesar la solicitud.' });
  }
}

function validateContact(contact) {
  if (!contact || typeof contact !== 'object') throw new Error('Payload inválido.');
  if (!contact.id || !contact.name || !contact.email || !contact.subject || !contact.message) {
    throw new Error('Faltan campos.');
  }
  if (String(contact.name).length > 100 || String(contact.message).length > 3000) {
    throw new Error('Campos demasiado largos.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact.email))) {
    throw new Error('Correo inválido.');
  }
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
