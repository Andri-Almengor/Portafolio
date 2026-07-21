import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import slugify from 'slugify';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadProjectImage } from '../middleware/upload.js';
import { sectionSchema, projectSchema, contactStatusSchema } from '../validators/schemas.js';
import { sheetsRepository } from '../services/sheets-repository.js';
import { driveService } from '../services/drive-service.js';
import { asyncRoute } from '../utils/async-route.js';
import { HttpError } from '../utils/http-error.js';
import { serializeContact, serializeProject, serializeSection } from '../utils/serializers.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

function sectionRow(data, current = {}) {
  const now = new Date().toISOString();
  return {
    id: current.id || randomUUID(),
    key: data.key,
    title: data.title,
    contentJson: JSON.stringify(data.content),
    sortOrder: data.sortOrder,
    visible: data.visible,
    createdAt: current.createdAt || now,
    updatedAt: now
  };
}

function projectRow(data, current = {}) {
  const now = new Date().toISOString();
  const slug = slugify(data.slug || data.title, { lower: true, strict: true, trim: true });
  if (!slug) throw new HttpError(400, 'No fue posible generar el slug.', 'INVALID_SLUG');

  return {
    id: current.id || randomUUID(),
    slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    technologiesJson: JSON.stringify(data.technologies),
    imageFileId: current.imageFileId || '',
    demoUrl: data.demoUrl,
    repoUrl: data.repoUrl,
    featured: data.featured,
    published: data.published,
    createdAt: current.createdAt || now,
    updatedAt: now,
    problem: data.problem,
    objective: data.objective,
    solution: data.solution,
    integration: data.integration,
    challenges: data.challenges,
    results: data.results
  };
}

adminRouter.get(
  '/sections',
  asyncRoute(async (_req, res) => {
    const sections = (await sheetsRepository.readAll('sections'))
      .map(serializeSection)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({ sections });
  })
);

adminRouter.post(
  '/sections',
  validate(sectionSchema),
  asyncRoute(async (req, res) => {
    const existing = await sheetsRepository.findOne('sections', 'key', req.body.key);
    if (existing) throw new HttpError(409, 'Ya existe una sección con esa clave.', 'SECTION_KEY_EXISTS');
    const row = sectionRow(req.body);
    await sheetsRepository.append('sections', row);
    res.status(201).json({ section: serializeSection(row) });
  })
);

adminRouter.put(
  '/sections/:id',
  validate(sectionSchema),
  asyncRoute(async (req, res) => {
    const current = await sheetsRepository.findById('sections', req.params.id);
    if (!current) throw new HttpError(404, 'Sección no encontrada.', 'SECTION_NOT_FOUND');
    const duplicate = await sheetsRepository.findOne('sections', 'key', req.body.key);
    if (duplicate && duplicate.id !== current.id) {
      throw new HttpError(409, 'Ya existe una sección con esa clave.', 'SECTION_KEY_EXISTS');
    }
    const updated = await sheetsRepository.updateById(
      'sections',
      current.id,
      sectionRow(req.body, current)
    );
    res.json({ section: serializeSection(updated) });
  })
);

adminRouter.delete(
  '/sections/:id',
  asyncRoute(async (req, res) => {
    const deleted = await sheetsRepository.deleteById('sections', req.params.id);
    if (!deleted) throw new HttpError(404, 'Sección no encontrada.', 'SECTION_NOT_FOUND');
    res.status(204).end();
  })
);

adminRouter.get(
  '/projects',
  asyncRoute(async (_req, res) => {
    const projects = (await sheetsRepository.readAll('projects'))
      .map(serializeProject)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ projects });
  })
);

adminRouter.post(
  '/projects',
  validate(projectSchema),
  asyncRoute(async (req, res) => {
    const row = projectRow(req.body);
    const duplicate = await sheetsRepository.findOne('projects', 'slug', row.slug);
    if (duplicate) throw new HttpError(409, 'Ya existe un proyecto con ese slug.', 'PROJECT_SLUG_EXISTS');
    await sheetsRepository.append('projects', row);
    res.status(201).json({ project: serializeProject(row) });
  })
);

adminRouter.put(
  '/projects/:id',
  validate(projectSchema),
  asyncRoute(async (req, res) => {
    const current = await sheetsRepository.findById('projects', req.params.id);
    if (!current) throw new HttpError(404, 'Proyecto no encontrado.', 'PROJECT_NOT_FOUND');
    const row = projectRow(req.body, current);
    const duplicate = await sheetsRepository.findOne('projects', 'slug', row.slug);
    if (duplicate && duplicate.id !== current.id) {
      throw new HttpError(409, 'Ya existe un proyecto con ese slug.', 'PROJECT_SLUG_EXISTS');
    }
    const updated = await sheetsRepository.updateById('projects', current.id, row);
    res.json({ project: serializeProject(updated) });
  })
);

adminRouter.post(
  '/projects/:id/image',
  uploadProjectImage,
  asyncRoute(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'Debe adjuntar una imagen.', 'IMAGE_REQUIRED');
    const current = await sheetsRepository.findById('projects', req.params.id);
    if (!current) throw new HttpError(404, 'Proyecto no encontrado.', 'PROJECT_NOT_FOUND');

    const uploaded = await driveService.uploadProjectImage({
      projectId: current.id,
      buffer: req.file.buffer
    });

    let updated;
    try {
      updated = await sheetsRepository.updateById('projects', current.id, {
        imageFileId: uploaded.id,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      await driveService.deleteFile(uploaded.id).catch(() => {});
      throw error;
    }

    if (current.imageFileId) {
      await driveService.deleteFile(current.imageFileId).catch(() => {});
    }

    res.json({ project: serializeProject(updated) });
  })
);

adminRouter.delete(
  '/projects/:id',
  asyncRoute(async (req, res) => {
    const current = await sheetsRepository.findById('projects', req.params.id);
    if (!current) throw new HttpError(404, 'Proyecto no encontrado.', 'PROJECT_NOT_FOUND');
    await sheetsRepository.deleteById('projects', current.id);
    if (current.imageFileId) await driveService.deleteFile(current.imageFileId).catch(() => {});
    res.status(204).end();
  })
);

adminRouter.get(
  '/contacts',
  asyncRoute(async (_req, res) => {
    const contacts = (await sheetsRepository.readAll('contacts'))
      .map(serializeContact)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ contacts });
  })
);

adminRouter.patch(
  '/contacts/:id/status',
  validate(contactStatusSchema),
  asyncRoute(async (req, res) => {
    const updated = await sheetsRepository.updateById('contacts', req.params.id, {
      status: req.body.status
    });
    if (!updated) throw new HttpError(404, 'Mensaje no encontrado.', 'CONTACT_NOT_FOUND');
    res.json({ contact: serializeContact(updated) });
  })
);
