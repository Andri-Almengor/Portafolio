import 'dotenv/config';
import { sheetsRepository } from '../src/services/sheets-repository.js';

async function main() {
  await sheetsRepository.ensureTables();
  console.log('Encabezados y pestañas de Google Sheets sincronizados correctamente.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
