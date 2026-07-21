import { z } from 'zod';

const urlOrEmpty = z.union([z.string().url(), z.literal('')]).default('');
const optionalProjectContent = z.string().trim().max(4000).optional().default('');

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128)
});

export const sectionSchema = z.object({
  key: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(120),
  content: z.unknown(),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
  visible: z.boolean().default(true)
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(140).regex(/^[a-z0-9-]*$/).optional().default(''),
  summary: z.string().trim().min(10).max(350),
  problem: optionalProjectContent,
  objective: optionalProjectContent,
  solution: optionalProjectContent,
  integration: optionalProjectContent,
  description: z.string().trim().min(10).max(4000),
  challenges: optionalProjectContent,
  results: optionalProjectContent,
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  demoUrl: urlOrEmpty,
  repoUrl: urlOrEmpty,
  featured: z.boolean().default(false),
  published: z.boolean().default(false)
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(''),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(3000),
  channel: z.enum(['email', 'whatsapp']).default('email'),
  company: z.string().max(0).optional().default(''),
  turnstileToken: z.string().max(4096).optional().default('')
});

export const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived'])
});
