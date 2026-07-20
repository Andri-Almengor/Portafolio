export const TABLES = Object.freeze({
  sections: {
    sheet: 'Sections',
    headers: [
      'id',
      'key',
      'title',
      'contentJson',
      'sortOrder',
      'visible',
      'createdAt',
      'updatedAt'
    ]
  },
  projects: {
    sheet: 'Projects',
    headers: [
      'id',
      'slug',
      'title',
      'summary',
      'description',
      'technologiesJson',
      'imageFileId',
      'demoUrl',
      'repoUrl',
      'featured',
      'published',
      'createdAt',
      'updatedAt'
    ]
  },
  admins: {
    sheet: 'Admins',
    headers: [
      'id',
      'email',
      'name',
      'passwordHash',
      'active',
      'createdAt',
      'updatedAt'
    ]
  },
  sessions: {
    sheet: 'Sessions',
    headers: [
      'id',
      'adminId',
      'refreshTokenHash',
      'expiresAt',
      'revokedAt',
      'createdAt',
      'lastUsedAt'
    ]
  },
  contacts: {
    sheet: 'Contacts',
    headers: [
      'id',
      'name',
      'email',
      'phone',
      'subject',
      'message',
      'channel',
      'status',
      'createdAt',
      'ipHash'
    ]
  }
});
