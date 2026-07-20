# Portafolio de Andrick Almengor

Primera base funcional, sin diseño visual, para un portafolio administrable construido con React + Vite, Node.js + Express, Google Sheets, Google Drive y Google Apps Script.

## Funcionalidad incluida

- Sitio público con secciones de perfil, experiencia, educación, certificaciones, habilidades e idiomas.
- Listado de proyectos y vista de detalle.
- Formulario de contacto por correo o WhatsApp.
- Panel de administración protegido por autenticación.
- CRUD de secciones editables y proyectos.
- Carga segura de imágenes a Google Drive.
- Almacenamiento en Google Sheets.
- Apps Script firmado con HMAC para enviar correos.
- Configuración inicial para Render.
- Controles de seguridad: validación, rate limiting, Helmet, CORS por lista permitida, tokens de acceso cortos, refresh token rotativo, hash de contraseñas, imágenes reprocesadas, honeypot y soporte opcional para Cloudflare Turnstile.

## Estructura

```text
client/                     React + Vite
server/                     API Node.js + Express
apps-script/contact-email/  Web App de Apps Script para correo
docs/                       Guías de despliegue, seguridad y esquema
render.yaml                 Blueprint de Render
```

## Inicio local

1. Copie los archivos de variables de entorno:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Instale dependencias:

```bash
npm install
```

3. Configure Google Sheets, Drive y Apps Script según `docs/GOOGLE_SETUP.md`.

4. Cree las pestañas y el administrador inicial:

```bash
npm run setup:sheets
```

5. Inicie frontend y backend:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`

## Despliegue

Revise `docs/DEPLOY_RENDER.md`. No agregue credenciales, llaves privadas, contraseñas ni IDs sensibles al repositorio.

## Estado del proyecto

Esta fase prioriza funcionalidad, estructura y seguridad. El diseño visual se agregará en una etapa posterior.
