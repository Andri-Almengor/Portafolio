# Despliegue en Render

El archivo `render.yaml` crea un único Web Service. Express sirve la API y también el build de React, de modo que frontend, cookies y API comparten el mismo origen.

1. En Render, cree un Blueprint desde este repositorio.
2. Complete todas las variables marcadas como `sync: false`.
3. Configure `FRONTEND_ORIGINS` y `PUBLIC_API_URL` con la URL exacta del servicio, por ejemplo `https://andrick-portfolio.onrender.com`, sin `/` final.
4. Configure las variables de Google, Drive y Apps Script.
5. `VITE_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY` son opcionales en pruebas, pero recomendados en producción.
6. Ejecute localmente `npm run setup:sheets` con las variables de producción para crear las hojas y el administrador.
7. Elimine `ADMIN_BOOTSTRAP_PASSWORD` del entorno cuando termine el alta inicial.

Render ejecutará `npm install && npm run build` y luego `npm --workspace server start`.
