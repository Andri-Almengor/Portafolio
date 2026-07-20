import { Router } from 'express';
import { sheetsRepository } from '../services/sheets-repository.js';
import { driveService } from '../services/drive-service.js';
import { asyncRoute } from '../utils/async-route.js';
import { parseBoolean } from '../utils/security.js';
import { serializeProject, serializeSection } from '../utils/serializers.js';
import { HttpError } from '../utils/http-error.js';

export const publicRouter = Router();

publicRouter.get(
  '/site',
  asyncRoute(async (_req, res) => {
    const rows = await sheetsRepository.readAll('sections');
    const sections = rows
      .map(serializeSection)
      .filter((section) => section.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ sections });
  })
);

publicRouter.get(
  '/projects',
  asyncRoute(async (_req, res) => {
    const rows = await sheetsRepository.readAll('projects');
    const projects = rows
      .filter((row) => parseBoolean(row.published))
      .map(serializeProject)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ projects });
  })
);

publicRouter.get(
  '/projects/:slug',
  asyncRoute(async (req, res) => {
    const row = await sheetsRepository.findOne('projects', 'slug', req.params.slug);
    if (!row || !parseBoolean(row.published)) {
      throw new HttpError(404, 'Proyecto no encontrado.', 'PROJECT_NOT_FOUND');
    }
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ project: serializeProject(row) });
  })
);

publicRouter.get(
  '/images/:fileId',
  asyncRoute(async (req, res) => {
    const rows = await sheetsRepository.readAll('projects');
    const authorized = rows.some(
      (row) => row.imageFileId === req.params.fileId && parseBoolean(row.published)
    );
    if (!authorized) throw new HttpError(404, 'Imagen no encontrada.', 'IMAGE_NOT_FOUND');

    const googleResponse = await driveService.getImageStream(req.params.fileId);
    res.set({
      'Content-Type': googleResponse.headers['content-type'] || 'image/webp',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'X-Content-Type-Options': 'nosniff'
    });
    googleResponse.data.on('error', (error) => res.destroy(error));
    googleResponse.data.pipe(res);
  })
);
