import { env } from '../config/env.js';
import { parseBoolean, parseJson } from './security.js';

export function serializeSection(row) {
  return {
    id: row.id,
    key: row.key,
    title: row.title,
    content: parseJson(row.contentJson, {}),
    sortOrder: Number(row.sortOrder || 0),
    visible: parseBoolean(row.visible),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export function serializeProject(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    technologies: parseJson(row.technologiesJson, []),
    imageFileId: row.imageFileId || '',
    imageUrl: row.imageFileId
      ? `${env.PUBLIC_API_URL}/api/public/images/${encodeURIComponent(row.imageFileId)}`
      : '',
    demoUrl: row.demoUrl || '',
    repoUrl: row.repoUrl || '',
    featured: parseBoolean(row.featured),
    published: parseBoolean(row.published),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export function serializeAdmin(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    active: parseBoolean(row.active)
  };
}

export function serializeContact(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    channel: row.channel,
    status: row.status,
    createdAt: row.createdAt
  };
}
