import { google } from 'googleapis';
import { env } from '../config/env.js';

let authClient;
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
  if (!authClient) {
    authClient = new google.auth.GoogleAuth({
      credentials: parseCredentials(),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]
    });
  }
  return authClient;
}

export function getSheetsClient() {
  if (!sheetsClient) {
    sheetsClient = google.sheets({ version: 'v4', auth: getGoogleAuth() });
  }
  return sheetsClient;
}

export function getDriveClient() {
  if (!driveClient) {
    driveClient = google.drive({ version: 'v3', auth: getGoogleAuth() });
  }
  return driveClient;
}
