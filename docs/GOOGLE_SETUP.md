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

La cuenta de servicio se mantiene para Sheets. El comando crea las pestañas `Sections`, `Projects`, `Admins`, `Sessions` y `Contacts`, agrega sus encabezados, carga el contenido inicial del CV y crea o actualiza el administrador.

## 3. Google Drive con OAuth de usuario

Las cuentas de servicio no tienen cuota de almacenamiento propia y no pueden crear archivos en una carpeta normal de **Mi unidad**. Para una cuenta personal de Google, las imágenes deben subirse mediante OAuth del propietario de la carpeta.

### Crear credenciales OAuth

1. Abra **Google Cloud > Google Auth Platform**.
2. Configure la pantalla de consentimiento OAuth.
3. Agregue su propio correo como usuario de prueba mientras realiza la configuración.
4. En **Clientes**, cree un cliente OAuth 2.0 de tipo **Aplicación de escritorio**.
5. Copie el Client ID y Client Secret.
6. En `server/.env`, agregue:

```env
GOOGLE_DRIVE_OAUTH_CLIENT_ID=...
GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=...
```

### Generar el refresh token

Desde la raíz del proyecto ejecute:

```bash
npm run authorize:drive
```

El navegador solicitará permiso para administrar Google Drive. Inicie sesión con la cuenta propietaria de la carpeta configurada en `GOOGLE_DRIVE_FOLDER_ID`.

Al terminar, la terminal mostrará:

```env
GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=...
```

Guarde ese valor en `server/.env` y en las variables privadas de Render. No lo comparta ni lo suba a GitHub.

### Carpeta de imágenes

1. Cree una carpeta normal en Google Drive con la misma cuenta autorizada.
2. Coloque su ID en `GOOGLE_DRIVE_FOLDER_ID`.
3. La cuenta de servicio puede seguir teniendo acceso de editor para lectura de compatibilidad, pero las cargas se harán como el usuario OAuth y consumirán la cuota de ese usuario.

Variables finales:

```env
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_DRIVE_OAUTH_CLIENT_ID=...
GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=...
GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=...
```

Si utiliza Google Workspace y una unidad compartida, también puede agregar la cuenta de servicio como miembro y usar una carpeta dentro de esa unidad. El backend incluye `supportsAllDrives=true` para esa modalidad.

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
