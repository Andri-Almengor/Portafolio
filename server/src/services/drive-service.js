import { Readable } from 'node:stream';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { env } from '../config/env.js';
import { getDriveClient } from './google-client.js';
import { HttpError } from '../utils/http-error.js';

function normalizeDriveError(error) {
  const providerCode = error?.response?.data?.error || error?.code;
  const providerDescription = error?.response?.data?.error_description || '';

  if (providerCode === 'unauthorized_client' || providerCode === 'invalid_client') {
    return new HttpError(
      502,
      'Google Drive rechazó el cliente OAuth. El Client ID, Client Secret y Refresh Token deben pertenecer al mismo cliente OAuth.',
      'DRIVE_OAUTH_UNAUTHORIZED_CLIENT'
    );
  }

  if (providerCode === 'invalid_grant') {
    return new HttpError(
      502,
      'El Refresh Token de Google Drive fue revocado, expiró o fue generado con otro cliente OAuth. Genere uno nuevo usando el mismo Client ID y Client Secret configurados en Render.',
      'DRIVE_OAUTH_INVALID_GRANT'
    );
  }

  if (providerCode === 403 || providerCode === 'insufficientPermissions') {
    return new HttpError(
      502,
      'La cuenta autorizada no tiene permisos para escribir en la carpeta configurada de Google Drive.',
      'DRIVE_PERMISSION_DENIED'
    );
  }

  if (/storage quota/i.test(providerDescription) || /storage quota/i.test(error?.message || '')) {
    return new HttpError(
      502,
      'La cuenta utilizada para Google Drive no dispone de cuota para crear archivos. Use OAuth de una cuenta personal o una unidad compartida.',
      'DRIVE_STORAGE_QUOTA_UNAVAILABLE'
    );
  }

  return error;
}

class DriveService {
  constructor() {
    this.drive = getDriveClient();
  }

  async processProjectImage(buffer) {
    return sharp(buffer, { failOn: 'warning', limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
  }

  async uploadProjectImage({ projectId, buffer }) {
    if (!env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new HttpError(503, 'GOOGLE_DRIVE_FOLDER_ID no está configurado.', 'DRIVE_NOT_CONFIGURED');
    }

    const processed = await this.processProjectImage(buffer);
    const name = `project-${projectId}-${randomUUID()}.webp`;

    try {
      const result = await this.drive.files.create({
        requestBody: {
          name,
          parents: [env.GOOGLE_DRIVE_FOLDER_ID],
          mimeType: 'image/webp'
        },
        media: {
          mimeType: 'image/webp',
          body: Readable.from(processed)
        },
        fields: 'id,name,mimeType,size',
        supportsAllDrives: true
      });

      return result.data;
    } catch (error) {
      throw normalizeDriveError(error);
    }
  }

  async getImageStream(fileId) {
    try {
      return await this.drive.files.get(
        { fileId, alt: 'media', supportsAllDrives: true },
        { responseType: 'stream' }
      );
    } catch (error) {
      throw normalizeDriveError(error);
    }
  }

  async deleteFile(fileId) {
    if (!fileId) return;
    try {
      await this.drive.files.delete({ fileId, supportsAllDrives: true });
    } catch (error) {
      if (error?.code !== 404) throw normalizeDriveError(error);
    }
  }
}

export const driveService = new DriveService();
