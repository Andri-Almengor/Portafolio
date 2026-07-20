# Configuración automática de Google Sheets, Drive y Apps Script

Este proyecto incluye un asistente de instalación en:

- `apps-script/contact-email/Code.gs`: recibe el formulario y envía el correo.
- `apps-script/contact-email/Setup.gs`: crea la hoja, las pestañas, las carpetas y comparte los recursos con la cuenta de servicio.
- `apps-script/contact-email/appsscript.json`: permisos requeridos por Apps Script.

## De dónde sale cada variable

| Variable | Cómo se obtiene |
| --- | --- |
| `GOOGLE_SPREADSHEET_ID` | La devuelve `setupPortfolioInfrastructure()` en Apps Script. |
| `GOOGLE_DRIVE_FOLDER_ID` | La devuelve `setupPortfolioInfrastructure()`; corresponde a la carpeta privada `project-images`. |
| `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` | Se obtiene al codificar en Base64 la llave JSON descargada desde Google Cloud. |
| `APPS_SCRIPT_CONTACT_URL` | URL `/exec` generada al desplegar Apps Script como aplicación web. |
| `CONTACT_HMAC_SECRET` | La genera y guarda automáticamente `setupPortfolioInfrastructure()`. |
| `JWT_ACCESS_SECRET` | Lo genera `npm run generate:secrets`. |
| `JWT_REFRESH_SECRET` | Lo genera `npm run generate:secrets`. |
| `IP_HASH_SALT` | Lo genera `npm run generate:secrets`. |
| `ADMIN_BOOTSTRAP_EMAIL` | Correo con el que iniciará sesión el administrador. |
| `ADMIN_BOOTSTRAP_NAME` | Nombre visible del administrador. |
| `ADMIN_BOOTSTRAP_PASSWORD` | Puede escogerlo o usar el valor generado por `npm run generate:secrets`. |

## 1. Crear la cuenta de servicio de Google

1. Entre a Google Cloud Console y cree un proyecto para el portafolio.
2. Active estas APIs en el proyecto:
   - Google Sheets API.
   - Google Drive API.
3. Vaya a **IAM y administración > Cuentas de servicio**.
4. Cree una cuenta llamada, por ejemplo, `portafolio-backend`.
5. Abra la cuenta creada y entre a **Claves > Agregar clave > Crear clave nueva > JSON**.
6. Guarde el archivo descargado en un lugar privado. No lo suba a GitHub.
7. Abra temporalmente el JSON y copie el valor de `client_email`.

Ejemplo del campo que necesita:

```json
{
  "client_email": "portafolio-backend@mi-proyecto.iam.gserviceaccount.com"
}
```

## 2. Crear automáticamente Sheets y Drive

1. Cree un proyecto nuevo en Google Apps Script.
2. Copie al proyecto estos archivos del repositorio:
   - `Code.gs`
   - `Setup.gs`
   - `appsscript.json`
3. En `Setup.gs`, reemplace:

```javascript
serviceAccountEmail: 'REEMPLAZAR_CON_CLIENT_EMAIL_DE_LA_CUENTA_DE_SERVICIO'
```

por el `client_email` copiado del JSON.

4. Confirme también el correo receptor:

```javascript
contactRecipientEmail: 'andrickalmengor@gmail.com'
```

5. Seleccione la función `setupPortfolioInfrastructure` y presione **Ejecutar**.
6. Autorice el acceso solicitado por Google.
7. Abra el registro de ejecución. La función devuelve los IDs, enlaces y el secreto HMAC.

El instalador crea:

```text
Mi unidad/
└── Portafolio Andrick/
    ├── Portafolio Andrick - Base de datos
    └── project-images/
```

La hoja incluye las pestañas:

- `Sections`
- `Projects`
- `Admins`
- `Sessions`
- `Contacts`

También agrega los encabezados, carga la información inicial del CV y comparte la hoja y la carpeta con la cuenta de servicio. Puede ejecutar la función nuevamente sin duplicar las secciones existentes.

Copie de la salida:

```env
GOOGLE_SPREADSHEET_ID=...
GOOGLE_DRIVE_FOLDER_ID=...
CONTACT_HMAC_SECRET=...
```

No publique el valor de `CONTACT_HMAC_SECRET`.

## 3. Desplegar el envío de correos

En el mismo proyecto de Apps Script:

1. Presione **Implementar > Nueva implementación**.
2. Seleccione **Aplicación web**.
3. Configure:
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
4. Presione **Implementar**.
5. Copie la URL que termina en `/exec`.
6. Colóquela en:

```env
APPS_SCRIPT_CONTACT_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
```

Después del despliegue también puede ejecutar `getPortfolioEnvironmentValues()` para volver a mostrar los IDs, la URL y el secreto guardado.

Aunque el Web App sea accesible públicamente, `doPost` rechaza solicitudes sin una firma HMAC válida y solicitudes con más de cinco minutos de antigüedad.

## 4. Convertir la llave JSON a Base64

En PowerShell, desde la carpeta donde está el JSON:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
```

Copie todo el resultado, en una sola línea, dentro de:

```env
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=RESULTADO_BASE64
```

No coloque comillas alrededor del Base64 en Render.

## 5. Generar los demás secretos

Desde la raíz del repositorio:

```bash
npm run generate:secrets
```

El comando produce valores criptográficamente aleatorios para:

```env
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
IP_HASH_SALT=...
ADMIN_BOOTSTRAP_PASSWORD=...
```

Guárdelos en un gestor de contraseñas. Si cambia los secretos JWT después del despliegue, las sesiones existentes dejarán de ser válidas, lo cual es esperado.

## 6. Crear el administrador inicial

Complete `server/.env` con todos los valores:

```env
GOOGLE_SPREADSHEET_ID=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=
APPS_SCRIPT_CONTACT_URL=

CONTACT_HMAC_SECRET=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
IP_HASH_SALT=

ADMIN_BOOTSTRAP_EMAIL=andrickalmengor@gmail.com
ADMIN_BOOTSTRAP_NAME=Andrick Almengor
ADMIN_BOOTSTRAP_PASSWORD=
```

Luego ejecute:

```bash
npm install
npm run setup:sheets
```

El comando usa bcrypt para crear o actualizar el administrador. La contraseña nunca se guarda en texto plano en Google Sheets.

## 7. Variables en Render

En el Web Service de Render agregue las mismas variables del archivo `server/.env`. No suba ese archivo al repositorio.

Para producción también debe configurar:

```env
NODE_ENV=production
FRONTEND_ORIGINS=https://SU-DOMINIO
PUBLIC_API_URL=https://SU-DOMINIO
```

`FRONTEND_ORIGINS` debe contener únicamente dominios controlados por usted. No utilice `*` en producción.

## Reglas de seguridad

- Nunca suba `service-account.json`, `.env`, contraseñas o secretos al repositorio.
- No comparta capturas donde aparezcan secretos o el contenido completo de la llave JSON.
- Mantenga la carpeta de imágenes privada; la API es la encargada de entregar las imágenes publicadas.
- Si una llave JSON se filtra, elimínela inmediatamente desde Google Cloud y cree una nueva.
- Ejecute el instalador desde su propia cuenta de Google, no desde una cuenta compartida.
