# Seguridad

Ninguna aplicación puede prometer seguridad absoluta. Esta base aplica defensa en profundidad y deja una lista explícita de tareas operativas.

## Controles implementados

- Contraseñas con bcrypt y costo 12.
- Tokens de acceso de corta duración solo en memoria del navegador.
- Refresh token `HttpOnly`, `Secure` en producción, rotación y detección de reutilización.
- Sesiones revocables almacenadas como hash, nunca como token en texto plano.
- CORS mediante lista exacta de orígenes y validación adicional del encabezado `Origin`.
- Helmet, HPP, límites de cuerpo, logs con secretos censurados y mensajes de error no sensibles.
- Rate limiting separado para login y contacto.
- Validación de entradas con Zod.
- Honeypot y soporte opcional de Cloudflare Turnstile.
- IP del formulario guardada únicamente como HMAC irreversible.
- Imágenes con límite de tamaño, MIME permitido y recodificación WEBP con Sharp para eliminar metadatos y contenido no esperado.
- Archivos privados en Drive, servidos únicamente cuando pertenecen a un proyecto publicado.
- Correo de Apps Script autenticado con HMAC SHA-256 y ventana de cinco minutos.
- Encabezados de seguridad para el sitio estático.

## Antes de producción

- Use secretos aleatorios de al menos 32 bytes y diferentes entre sí.
- Active MFA en GitHub, Google y Render.
- Restrinja quién puede editar la hoja, carpeta y Apps Script.
- No comparta la cuenta de servicio ni sus llaves.
- Active Turnstile para el formulario público.
- Revise logs, dependencias y sesiones con regularidad.
- Configure alertas de disponibilidad y errores.
- Mantenga una copia de respaldo de Sheets y Drive.
- Pruebe restauración, revocación de sesiones y cambio de contraseña.
- Añada pruebas automáticas de integración antes de publicar cambios grandes.
