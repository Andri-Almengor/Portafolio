/**
 * Configuración de una sola ejecución para crear la infraestructura de Google.
 *
 * Antes de ejecutar setupPortfolioInfrastructure():
 * 1. Cree la cuenta de servicio en Google Cloud.
 * 2. Copie el valor "client_email" del JSON en serviceAccountEmail.
 * 3. Confirme el correo que recibirá los mensajes del formulario.
 */
var PORTFOLIO_SETUP_CONFIG = Object.freeze({
  serviceAccountEmail: 'REEMPLAZAR_CON_CLIENT_EMAIL_DE_LA_CUENTA_DE_SERVICIO',
  contactRecipientEmail: 'andrickalmengor@gmail.com',
  spreadsheetName: 'Portafolio Andrick - Base de datos',
  rootFolderName: 'Portafolio Andrick',
  imagesFolderName: 'project-images'
});

var PORTFOLIO_TABLES = Object.freeze({
  Sections: [
    'id',
    'key',
    'title',
    'contentJson',
    'sortOrder',
    'visible',
    'createdAt',
    'updatedAt'
  ],
  Projects: [
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
  ],
  Admins: [
    'id',
    'email',
    'name',
    'passwordHash',
    'active',
    'createdAt',
    'updatedAt'
  ],
  Sessions: [
    'id',
    'adminId',
    'refreshTokenHash',
    'expiresAt',
    'revokedAt',
    'createdAt',
    'lastUsedAt'
  ],
  Contacts: [
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
});

var INITIAL_SECTIONS = [
  {
    key: 'hero',
    title: 'Presentación',
    sortOrder: 10,
    visible: true,
    content: {
      name: 'Andrick Almengor Quiros',
      headline: 'Desarrollo de software | Soporte Técnico | Help Desk L1-L2',
      location: 'San José, Costa Rica',
      email: 'andrickalmengor@gmail.com',
      phone: '+506 7139-0044',
      linkedin: 'https://www.linkedin.com/in/andrick-almengor-5aa69b2b2'
    }
  },
  {
    key: 'about',
    title: 'Sobre mí',
    sortOrder: 20,
    visible: true,
    content: {
      paragraphs: [
        'Especialista en soporte técnico y mesa de servicio con experiencia en soporte L1 y L2 para usuarios corporativos.',
        'Experiencia en desarrollo de aplicaciones web y de escritorio, automatización de procesos, integración de APIs, Google Apps Script, AppSheet, React, React Native y Python.',
        'Conocimientos en hardware, software, redes, sistemas operativos, Active Directory, OnGuard y Milestone XProtect.'
      ]
    }
  },
  {
    key: 'experience',
    title: 'Experiencia',
    sortOrder: 30,
    visible: true,
    content: {
      items: [
        {
          role: 'Help Desk',
          company: 'Digital Management Systems',
          period: 'Enero 2025 – Julio 2026',
          achievements: [
            'Diseño y desarrollo de aplicaciones web y de escritorio para automatizar procesos internos.',
            'Desarrollo con React, React Native, Python, Google Apps Script y AppSheet, integrando bases de datos, servicios web y APIs.',
            'Implementación de sistemas para boletas, mantenimientos, reportes PDF, evidencias e integración con Google Drive.',
            'Diseño de APIs y scripts para sincronizar información entre plataformas y reducir tareas manuales.',
            'Desarrollo de interfaces responsivas para aplicaciones web y móviles.',
            'Integración de herramientas para plataformas de videovigilancia y control de acceso.',
            'Creación de documentación técnica, manuales y bases de conocimiento.'
          ]
        },
        {
          role: 'Service Desk (Temporal)',
          company: 'NETCOM BUSINESS CONTACT CENTER S.A',
          period: 'Junio 2024 – Agosto 2024',
          achievements: [
            'Gestión del ciclo completo de incidencias y requerimientos de TI para más de 100 usuarios mediante ServiceNow.',
            'Cumplimiento del 98% de los SLA pactados.',
            'Soporte telefónico, remoto y presencial para aplicaciones empresariales.'
          ]
        },
        {
          role: 'Soporte técnico (Práctica profesional)',
          company: 'Istmo Center',
          period: 'Octubre 2023 – Noviembre 2023',
          achievements: [
            'Despliegue, ensamble, configuración y mantenimiento de más de 100 equipos.',
            'Administración de cuentas, perfiles de seguridad y permisos.',
            'Apoyo en la reestructuración del mantenimiento de hardware, reduciendo fallas operativas.'
          ]
        }
      ]
    }
  },
  {
    key: 'education',
    title: 'Educación',
    sortOrder: 40,
    visible: true,
    content: {
      items: [
        {
          title: 'Bachillerato en Ingeniería Informática',
          institution: 'Universidad Castro Carazo',
          status: 'En curso'
        },
        {
          title: 'Técnico Medio en Informática con énfasis en Desarrollo Web',
          institution: 'Colegio Técnico Profesional de Aserrí',
          status: 'Graduado en 2023'
        }
      ]
    }
  },
  {
    key: 'certifications',
    title: 'Certificaciones y cursos',
    sortOrder: 50,
    visible: true,
    content: {
      items: [
        'Cisco Networking Academy: CCNAv7 (módulos cursados)',
        'IT Essentials',
        'Cybersecurity Essentials',
        'Certificación de producto OnGuard',
        'Milestone Certified Integration Technician (MCIT)'
      ]
    }
  },
  {
    key: 'skills',
    title: 'Habilidades técnicas',
    sortOrder: 60,
    visible: true,
    content: {
      groups: [
        {
          name: 'Desarrollo y automatización',
          items: [
            'React',
            'React Native',
            'Node.js',
            'Express',
            'Python',
            'Google Apps Script',
            'AppSheet',
            'APIs',
            'Automatización de procesos'
          ]
        },
        {
          name: 'Soporte y mesa de servicio',
          items: [
            'Help Desk L1/L2',
            'Service Desk',
            'ServiceNow',
            'Gestión de incidentes',
            'SLA',
            'Soporte remoto y presencial'
          ]
        },
        {
          name: 'Sistemas y plataformas',
          items: [
            'Windows 10/11',
            'Active Directory',
            'TCP/IP',
            'OnGuard',
            'Milestone XProtect',
            'Hardware y software'
          ]
        }
      ]
    }
  },
  {
    key: 'soft-skills',
    title: 'Habilidades blandas',
    sortOrder: 70,
    visible: true,
    content: {
      items: [
        'Resolución de problemas',
        'Atención al cliente',
        'Comunicación efectiva',
        'Trabajo en equipo',
        'Adaptabilidad',
        'Gestión del tiempo',
        'Orientación al servicio',
        'Aprendizaje continuo'
      ]
    }
  },
  {
    key: 'languages',
    title: 'Idiomas',
    sortOrder: 80,
    visible: true,
    content: {
      items: [
        { language: 'Español', level: 'Nativo' },
        { language: 'Inglés', level: 'Básico (A2)' }
      ]
    }
  }
];

/**
 * Crea o recupera la hoja, las carpetas y las propiedades del Web App.
 * La función es idempotente: si se ejecuta otra vez, reutiliza los IDs guardados.
 */
function setupPortfolioInfrastructure() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    throw new Error('Ya existe otra inicialización en curso. Espere unos segundos e intente nuevamente.');
  }

  try {
    validateSetupConfig_();

    var properties = PropertiesService.getScriptProperties();
    var rootFolder = getOrCreateRootFolder_(properties);
    var imagesFolder = getOrCreateImagesFolder_(properties, rootFolder);
    var spreadsheet = getOrCreateSpreadsheet_(properties, rootFolder);

    Object.keys(PORTFOLIO_TABLES).forEach(function(sheetName) {
      ensureSheet_(spreadsheet, sheetName, PORTFOLIO_TABLES[sheetName]);
    });

    seedInitialSections_(spreadsheet.getSheetByName('Sections'));
    shareResources_(spreadsheet, rootFolder, PORTFOLIO_SETUP_CONFIG.serviceAccountEmail);

    var hmacSecret = properties.getProperty('CONTACT_HMAC_SECRET');
    if (!hmacSecret) {
      hmacSecret = generateSecret_();
    }

    properties.setProperties({
      PORTFOLIO_SPREADSHEET_ID: spreadsheet.getId(),
      PORTFOLIO_ROOT_FOLDER_ID: rootFolder.getId(),
      PORTFOLIO_DRIVE_FOLDER_ID: imagesFolder.getId(),
      CONTACT_RECIPIENT_EMAIL: PORTFOLIO_SETUP_CONFIG.contactRecipientEmail,
      CONTACT_HMAC_SECRET: hmacSecret
    }, false);

    SpreadsheetApp.flush();

    var result = buildEnvironmentResult_(spreadsheet, rootFolder, imagesFolder, hmacSecret);
    console.log(JSON.stringify(result, null, 2));
    return result;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Devuelve los valores que deben copiarse al archivo .env o a Render.
 * No publique ni comparta la salida porque contiene CONTACT_HMAC_SECRET.
 */
function getPortfolioEnvironmentValues() {
  var properties = PropertiesService.getScriptProperties();
  var spreadsheetId = properties.getProperty('PORTFOLIO_SPREADSHEET_ID');
  var rootFolderId = properties.getProperty('PORTFOLIO_ROOT_FOLDER_ID');
  var imagesFolderId = properties.getProperty('PORTFOLIO_DRIVE_FOLDER_ID');
  var hmacSecret = properties.getProperty('CONTACT_HMAC_SECRET');

  if (!spreadsheetId || !imagesFolderId || !hmacSecret) {
    throw new Error('Primero ejecute setupPortfolioInfrastructure().');
  }

  var result = {
    GOOGLE_SPREADSHEET_ID: spreadsheetId,
    GOOGLE_DRIVE_FOLDER_ID: imagesFolderId,
    APPS_SCRIPT_CONTACT_URL: ScriptApp.getService().getUrl() || 'DESPLIEGUE_PENDIENTE',
    CONTACT_HMAC_SECRET: hmacSecret,
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit',
    rootFolderUrl: 'https://drive.google.com/drive/folders/' + rootFolderId,
    imagesFolderUrl: 'https://drive.google.com/drive/folders/' + imagesFolderId
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
}

function validateSetupConfig_() {
  var serviceAccountEmail = String(PORTFOLIO_SETUP_CONFIG.serviceAccountEmail || '').trim();
  var recipientEmail = String(PORTFOLIO_SETUP_CONFIG.contactRecipientEmail || '').trim();
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(serviceAccountEmail) || serviceAccountEmail.indexOf('REEMPLAZAR_') === 0) {
    throw new Error('Reemplace serviceAccountEmail con el client_email del JSON de la cuenta de servicio.');
  }

  if (!emailPattern.test(recipientEmail)) {
    throw new Error('contactRecipientEmail no es un correo válido.');
  }
}

function getOrCreateRootFolder_(properties) {
  var folderId = properties.getProperty('PORTFOLIO_ROOT_FOLDER_ID');
  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (error) {
      console.warn('No fue posible reutilizar la carpeta raíz guardada: ' + error.message);
    }
  }

  var folder = DriveApp.createFolder(PORTFOLIO_SETUP_CONFIG.rootFolderName);
  properties.setProperty('PORTFOLIO_ROOT_FOLDER_ID', folder.getId());
  return folder;
}

function getOrCreateImagesFolder_(properties, rootFolder) {
  var folderId = properties.getProperty('PORTFOLIO_DRIVE_FOLDER_ID');
  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch (error) {
      console.warn('No fue posible reutilizar la carpeta de imágenes guardada: ' + error.message);
    }
  }

  var existing = rootFolder.getFoldersByName(PORTFOLIO_SETUP_CONFIG.imagesFolderName);
  var folder = existing.hasNext()
    ? existing.next()
    : rootFolder.createFolder(PORTFOLIO_SETUP_CONFIG.imagesFolderName);

  properties.setProperty('PORTFOLIO_DRIVE_FOLDER_ID', folder.getId());
  return folder;
}

function getOrCreateSpreadsheet_(properties, rootFolder) {
  var spreadsheetId = properties.getProperty('PORTFOLIO_SPREADSHEET_ID');
  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      console.warn('No fue posible reutilizar la hoja guardada: ' + error.message);
    }
  }

  var spreadsheet = SpreadsheetApp.create(PORTFOLIO_SETUP_CONFIG.spreadsheetName, 100, 15);
  DriveApp.getFileById(spreadsheet.getId()).moveTo(rootFolder);
  properties.setProperty('PORTFOLIO_SPREADSHEET_ID', spreadsheet.getId());
  return spreadsheet;
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    var sheets = spreadsheet.getSheets();
    var reusableDefault = sheets.length === 1 && sheets[0].getLastRow() === 0;
    sheet = reusableDefault ? sheets[0].setName(sheetName) : spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    var currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    var matches = headers.every(function(header, index) {
      return String(currentHeaders[index]) === header;
    });

    if (!matches) {
      throw new Error(
        'La pestaña ' + sheetName + ' ya existe, pero sus encabezados no coinciden. No se modificó para evitar pérdida de datos.'
      );
    }
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setWrap(true);
  sheet.autoResizeColumns(1, headers.length);
}

function seedInitialSections_(sheet) {
  var existingKeys = {};
  if (sheet.getLastRow() > 1) {
    var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, PORTFOLIO_TABLES.Sections.length).getValues();
    values.forEach(function(row) {
      existingKeys[String(row[1])] = true;
    });
  }

  var now = new Date().toISOString();
  var rows = INITIAL_SECTIONS
    .filter(function(section) {
      return !existingKeys[section.key];
    })
    .map(function(section) {
      return [
        Utilities.getUuid(),
        section.key,
        section.title,
        JSON.stringify(section.content),
        section.sortOrder,
        section.visible,
        now,
        now
      ];
    });

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, PORTFOLIO_TABLES.Sections.length).setValues(rows);
  }
}

function shareResources_(spreadsheet, rootFolder, serviceAccountEmail) {
  try {
    spreadsheet.addEditor(serviceAccountEmail);
    rootFolder.addEditor(serviceAccountEmail);
  } catch (error) {
    throw new Error(
      'No se pudieron compartir los recursos con la cuenta de servicio. Revise el correo y las políticas de Google Drive. Detalle: ' +
      error.message
    );
  }
}

function generateSecret_() {
  var seed = [
    Utilities.getUuid(),
    Utilities.getUuid(),
    Utilities.getUuid(),
    String(Date.now()),
    Session.getTemporaryActiveUserKey()
  ].join(':');

  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    seed,
    Utilities.Charset.UTF_8
  );

  return Utilities.base64EncodeWebSafe(digest).replace(/=+$/g, '');
}

function buildEnvironmentResult_(spreadsheet, rootFolder, imagesFolder, hmacSecret) {
  return {
    GOOGLE_SPREADSHEET_ID: spreadsheet.getId(),
    GOOGLE_DRIVE_FOLDER_ID: imagesFolder.getId(),
    APPS_SCRIPT_CONTACT_URL: ScriptApp.getService().getUrl() || 'DESPLIEGUE_PENDIENTE',
    CONTACT_HMAC_SECRET: hmacSecret,
    spreadsheetUrl: spreadsheet.getUrl(),
    rootFolderUrl: 'https://drive.google.com/drive/folders/' + rootFolder.getId(),
    imagesFolderUrl: 'https://drive.google.com/drive/folders/' + imagesFolder.getId(),
    nextStep: 'Despliegue este proyecto como Web App y luego ejecute getPortfolioEnvironmentValues().'
  };
}
