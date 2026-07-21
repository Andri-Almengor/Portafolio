import 'dotenv/config';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { google } from 'googleapis';

const HOST = '127.0.0.1';
const PORT = 53682;
const REDIRECT_URI = `http://${HOST}:${PORT}/oauth2callback`;
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

const clientId = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error([
    'Faltan variables OAuth de Google Drive.',
    'Configure en server/.env:',
    'GOOGLE_DRIVE_OAUTH_CLIENT_ID=',
    'GOOGLE_DRIVE_OAUTH_CLIENT_SECRET='
  ].join('\n'));
  process.exit(1);
}

const oauthClient = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
const authorizationUrl = oauthClient.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  include_granted_scopes: true,
  scope: [DRIVE_SCOPE]
});

function openBrowser(url) {
  const command = process.platform === 'win32'
    ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin'
      ? ['open', [url]]
      : ['xdg-open', [url]];

  try {
    const child = spawn(command[0], command[1], { detached: true, stdio: 'ignore' });
    child.unref();
  } catch {
    // La URL también se imprime para apertura manual.
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', REDIRECT_URI);

  if (requestUrl.pathname !== '/oauth2callback') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Ruta no encontrada.');
    return;
  }

  const error = requestUrl.searchParams.get('error');
  const code = requestUrl.searchParams.get('code');

  if (error || !code) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`Autorización cancelada o inválida: ${error || 'sin código'}`);
    server.close();
    return;
  }

  try {
    const { tokens } = await oauthClient.getToken(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      throw new Error(
        'Google no devolvió refresh_token. Revoca el acceso anterior y ejecuta nuevamente este asistente.'
      );
    }

    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(
      '<h1>Google Drive autorizado</h1><p>Ya puedes cerrar esta ventana y volver a la terminal.</p>'
    );

    console.log('\nAutorización completada.');
    console.log('Guarda esta variable únicamente en server/.env y en Render:');
    console.log(`GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=${refreshToken}`);
    console.log('\nNo publiques ni compartas este token.');
  } catch (exchangeError) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('No fue posible completar la autorización. Revisa la terminal.');
    console.error(exchangeError);
  } finally {
    setTimeout(() => server.close(), 500);
  }
});

server.listen(PORT, HOST, () => {
  console.log('Abriendo autorización de Google Drive...');
  console.log(`Redirect URI local: ${REDIRECT_URI}`);
  console.log('\nAbre esta URL si el navegador no se abre automáticamente:\n');
  console.log(authorizationUrl);
  openBrowser(authorizationUrl);
});

server.on('error', (error) => {
  console.error(`No fue posible iniciar el servidor local en ${REDIRECT_URI}.`);
  console.error(error);
  process.exit(1);
});
