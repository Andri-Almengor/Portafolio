import { google } from 'googleapis';
import { env } from '../config/env.js';

let serviceAccountAuth;
let driveAuth;
let sheetsClient;
let driveClient;

function parseCredentials() {
  const configured = env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!configured) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 no está configurado.');
  }

  let text = configured.trim();
  if (!text.startsWith('{')) {
    text = Buffer.from(text, 'base64').toString('utf8');
  }

  const credentials = JSON.parse(text);
  if (typeof credentials.private_key === 'string') {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }
  return credentials;
}

export function getGoogleAuth() {
  if (!serviceAccountAuth) {
    serviceAccountAuth = new google.auth.GoogleAuth({
      credentials: parseCredentials(),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]
    });
  }
  return serviceAccountAuth;
}

function getDriveAuth() {
  if (driveAuth) return driveAuth;

  const oauthValues = [
    env.GOOGLE_DRIVE_OAUTH_CLIENT_ID,
    env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET,
    env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN
  ];
  const configuredCount = oauthValues.filter(Boolean).length;

  if (configuredCount > 0 && configuredCount < oauthValues.length) {
    throw new Error(
      'La configuración OAuth de Google Drive está incompleta. Configure CLIENT_ID, CLIENT_SECRET y REFRESH_TOKEN.'
    );
  }

  if (configuredCount === oauthValues.length) {
    const oauthClient = new google.auth.OAuth2(
      env.GOOGLE_DRIVE_OAUTH_CLIENT_ID,
      env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET
    );
    oauthClient.setCredentials({ refresh_token: env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN });
    driveAuth = oauthClient;
    return driveAuth;
  }

  driveAuth = getGoogleAuth();
  return driveAuth;
}

export function getSheetsClient() {
  if (!sheetsClient) {
    sheetsClient = google.sheets({ version: 'v4', auth: getGoogleAuth() });
  }
  return sheetsClient;
}

export function getDriveClient() {
  if (!driveClient) {
    driveClient = google.drive({ version: 'v3', auth: getDriveAuth() });
  }
  return driveClient;
}
