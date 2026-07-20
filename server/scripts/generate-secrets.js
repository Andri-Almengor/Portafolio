import { randomBytes } from 'node:crypto';

function generateSecret(bytes = 48) {
  return randomBytes(bytes).toString('base64url');
}

const values = {
  CONTACT_HMAC_SECRET: generateSecret(),
  JWT_ACCESS_SECRET: generateSecret(),
  JWT_REFRESH_SECRET: generateSecret(),
  IP_HASH_SALT: generateSecret(),
  ADMIN_BOOTSTRAP_PASSWORD: generateSecret(18)
};

console.log('# Copie estos valores en server/.env o en las variables de Render.');
console.log('# No los suba a GitHub ni los comparta públicamente.');
console.log('');

for (const [key, value] of Object.entries(values)) {
  console.log(`${key}=${value}`);
}
