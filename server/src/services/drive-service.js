import { Readable } from 'node:stream';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { env } from '../config/env.js';
import { getDriveClient } from './google-client.js';

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
      throw new Error('GOOGLE_DRIVE_FOLDER_ID no está configurado.');
    }

    const processed = await this.processProjectImage(buffer);
    const name = `project-${projectId}-${randomUUID()}.webp`;
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
      fields: 'id,name,mimeType,size'
    });

    return result.data;
  }

  async getImageStream(fileId) {
    return this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
  }

  async deleteFile(fileId) {
    if (!fileId) return;
    try {
      await this.drive.files.delete({ fileId });
    } catch (error) {
      if (error?.code !== 404) throw error;
    }
  }
}

export const driveService = new DriveService();
