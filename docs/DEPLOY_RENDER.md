# Despliegue en Render

El archivo `render.yaml` crea un único Web Service. Express sirve la API y también el build de React, de modo que frontend, cookies y API comparten el mismo origen.

## Antes de desplegar

1. Confirme que la interfaz y el backend funcionan localmente.
2. Integre la rama `feature/stitch-interface` en `main`.
3. No suba `server/.env`, la llave JSON de Google ni secretos al repositorio.
4. Confirme que Apps Script utiliza una URL terminada en `/exec` y que el correo de prueba funciona.

## Crear el Blueprint

1. Entre a Render y conecte su cuenta de GitHub.
2. Seleccione **New > Blueprint**.
3. Elija el repositorio `Andri-Almengor/Portafolio`.
4. Render detectará `render.yaml` en la raíz.
5. Cree el Blueprint y complete las variables marcadas como `sync: false`.

## Variables obligatorias

Use la URL real asignada por Render, sin `/` al final, en:

```env
FRONTEND_ORIGINS=https://andrick-portfolio.onrender.com
PUBLIC_API_URL=https://andrick-portfolio.onrender.com
```

Configure también:

```env
GOOGLE_SPREADSHEET_ID=...
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=...
APPS_SCRIPT_CONTACT_URL=https://script.google.com/macros/s/.../exec
CONTACT_HMAC_SECRET=...
```

`CONTACT_HMAC_SECRET` debe ser exactamente el mismo valor configurado en las propiedades de Apps Script. Render no debe generar este secreto automáticamente.

Opcionales, pero recomendadas en producción:

```env
TURNSTILE_SECRET_KEY=...
VITE_TURNSTILE_SITE_KEY=...
```

Render genera automáticamente valores seguros para:

```env
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
IP_HASH_SALT
```

## Proceso de construcción

Render ejecutará:

```bash
npm install && npm run build
```

Después iniciará el backend con:

```bash
npm --workspace server start
```

El servicio valida su estado mediante:

```text
/api/health
```

## Después del primer despliegue

1. Abra la URL pública asignada por Render.
2. Verifique `/api/health`.
3. Pruebe el inicio, proyectos, formulario por correo, WhatsApp y login administrativo.
4. Si la URL asignada es diferente a la esperada, actualice `FRONTEND_ORIGINS` y `PUBLIC_API_URL` en **Environment** y seleccione **Save, rebuild, and deploy**.
5. Verifique que la hoja y la carpeta de Drive sigan compartidas con la cuenta de servicio.

No hace falta ejecutar `npm run setup:sheets` dentro de Render si la hoja y el administrador ya fueron creados localmente y el despliegue utiliza la misma hoja de cálculo.
