export const INITIAL_SECTIONS = [
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
          items: ['React', 'React Native', 'Node.js', 'Express', 'Python', 'Google Apps Script', 'AppSheet', 'APIs', 'Automatización de procesos']
        },
        {
          name: 'Soporte y mesa de servicio',
          items: ['Help Desk L1/L2', 'Service Desk', 'ServiceNow', 'Gestión de incidentes', 'SLA', 'Soporte remoto y presencial']
        },
        {
          name: 'Sistemas y plataformas',
          items: ['Windows 10/11', 'Active Directory', 'TCP/IP', 'OnGuard', 'Milestone XProtect', 'Hardware y software']
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
      items: ['Resolución de problemas', 'Atención al cliente', 'Comunicación efectiva', 'Trabajo en equipo', 'Adaptabilidad', 'Gestión del tiempo', 'Orientación al servicio', 'Aprendizaje continuo']
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
