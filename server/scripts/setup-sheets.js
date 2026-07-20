import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import { sheetsRepository } from '../src/services/sheets-repository.js';
import { INITIAL_SECTIONS } from '../src/data/initial-sections.js';

async function main() {
  if (!env.ADMIN_BOOTSTRAP_EMAIL || !env.ADMIN_BOOTSTRAP_NAME || !env.ADMIN_BOOTSTRAP_PASSWORD) {
    throw new Error(
      'Configure ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_NAME y ADMIN_BOOTSTRAP_PASSWORD antes de ejecutar este comando.'
    );
  }

  await sheetsRepository.ensureTables();

  const existingSections = await sheetsRepository.readAll('sections');
  const keys = new Set(existingSections.map((section) => section.key));
  for (const section of INITIAL_SECTIONS) {
    if (keys.has(section.key)) continue;
    const now = new Date().toISOString();
    await sheetsRepository.append('sections', {
      id: randomUUID(),
      key: section.key,
      title: section.title,
      contentJson: JSON.stringify(section.content),
      sortOrder: section.sortOrder,
      visible: section.visible,
      createdAt: now,
      updatedAt: now
    });
  }

  const email = env.ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
  const existingAdmin = await sheetsRepository.findOne('admins', 'email', email);
  const passwordHash = await bcrypt.hash(env.ADMIN_BOOTSTRAP_PASSWORD, 12);
  const now = new Date().toISOString();

  if (existingAdmin) {
    await sheetsRepository.updateById('admins', existingAdmin.id, {
      name: env.ADMIN_BOOTSTRAP_NAME,
      passwordHash,
      active: true,
      updatedAt: now
    });
    console.log(`Administrador actualizado: ${email}`);
  } else {
    await sheetsRepository.append('admins', {
      id: randomUUID(),
      email,
      name: env.ADMIN_BOOTSTRAP_NAME,
      passwordHash,
      active: true,
      createdAt: now,
      updatedAt: now
    });
    console.log(`Administrador creado: ${email}`);
  }

  console.log('Google Sheets quedó inicializado correctamente.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
