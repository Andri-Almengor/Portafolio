# Configuración de Google Sheets, Drive y Apps Script

## 1. Google Cloud

1. Cree un proyecto en Google Cloud.
2. Active Google Sheets API y Google Drive API.
3. Cree una cuenta de servicio y descargue su archivo JSON.
4. Codifique el JSON en Base64 y guárdelo en `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`.
5. Nunca suba el JSON al repositorio.

En PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
```

## 2. Google Sheets

1. Cree una hoja de cálculo vacía.
2. Compártala como editor con el correo de la cuenta de servicio.
3. Copie su ID en `GOOGLE_SPREADSHEET_ID`.
4. Configure las variables del administrador inicial.
5. Ejecute `npm run setup:sheets` desde la raíz.

El comando crea las pestañas `Sections`, `Projects`, `Admins`, `Sessions` y `Contacts`, agrega sus encabezados, carga el contenido inicial del CV y crea o actualiza el administrador.

## 3. Google Drive

1. Cree una carpeta para las imágenes del portafolio.
2. Compártala como editor con la cuenta de servicio.
3. Coloque el ID en `GOOGLE_DRIVE_FOLDER_ID`.

Las imágenes permanecen privadas en Drive. La API solo entrega archivos asociados a proyectos publicados.

## 4. Apps Script

1. Cree un proyecto nuevo de Apps Script.
2. Copie `apps-script/contact-email/Code.gs` y `appsscript.json`.
3. En **Configuración del proyecto > Propiedades del script**, agregue:
   - `CONTACT_RECIPIENT_EMAIL`: correo que recibirá los mensajes.
   - `CONTACT_HMAC_SECRET`: exactamente el mismo secreto del backend.
4. Despliegue como aplicación web:
   - Ejecutar como: usted.
   - Acceso: cualquiera.
5. Copie la URL terminada en `/exec` a `APPS_SCRIPT_CONTACT_URL`.

Aunque el Web App sea público, solo procesa solicitudes recientes que tengan una firma HMAC válida.
