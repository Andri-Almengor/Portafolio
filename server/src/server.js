import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, environment: env.NODE_ENV }, 'API iniciada');
});

function shutdown(signal) {
  logger.info({ signal }, 'Cerrando API');
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, 'Error al cerrar el servidor');
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (error) => logger.error({ err: error }, 'Promesa rechazada'));
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Excepción no controlada');
  process.exit(1);
});
