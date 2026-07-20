import test from 'node:test';
import assert from 'node:assert/strict';
import { constantTimeEqual, hmacSha256, parseBoolean, parseJson, sha256 } from './security.js';

test('sha256 produce un hash estable', () => {
  assert.equal(sha256('abc').length, 64);
  assert.equal(sha256('abc'), sha256('abc'));
});

test('HMAC cambia al usar otra llave', () => {
  assert.notEqual(hmacSha256('mensaje', 'a'), hmacSha256('mensaje', 'b'));
});

test('comparación constante valida valores iguales', () => {
  assert.equal(constantTimeEqual('abc', 'abc'), true);
  assert.equal(constantTimeEqual('abc', 'abd'), false);
  assert.equal(constantTimeEqual('abc', 'abcd'), false);
});

test('convierte booleanos y JSON almacenados en Sheets', () => {
  assert.equal(parseBoolean('TRUE'), true);
  assert.equal(parseBoolean('false'), false);
  assert.deepEqual(parseJson('{"ok":true}', {}), { ok: true });
  assert.deepEqual(parseJson('invalido', []), []);
});
