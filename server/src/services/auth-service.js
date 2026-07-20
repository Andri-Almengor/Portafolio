import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sheetsRepository } from './sheets-repository.js';
import { constantTimeEqual, parseBoolean, sha256 } from '../utils/security.js';
import { serializeAdmin } from '../utils/serializers.js';
import { HttpError } from '../utils/http-error.js';

const ISSUER = 'andrick-portfolio-api';
const AUDIENCE = 'andrick-portfolio-admin';

function createAccessToken(admin) {
  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      type: 'access'
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_TTL,
      issuer: ISSUER,
      audience: AUDIENCE
    }
  );
}

function createRefreshToken(adminId, sessionId) {
  return jwt.sign(
    {
      sub: adminId,
      sid: sessionId,
      nonce: randomUUID(),
      type: 'refresh'
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
      issuer: ISSUER,
      audience: AUDIENCE
    }
  );
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: ISSUER,
    audience: AUDIENCE
  });
  if (payload.type !== 'refresh' || !payload.sid || !payload.sub) {
    throw new HttpError(401, 'Sesión inválida.', 'INVALID_SESSION');
  }
  return payload;
}

export class AuthService {
  async login(email, password) {
    const adminRow = await sheetsRepository.findOne('admins', 'email', email.toLowerCase());
    const valid = adminRow
      && parseBoolean(adminRow.active)
      && await bcrypt.compare(password, adminRow.passwordHash);

    if (!valid) {
      throw new HttpError(401, 'Correo o contraseña incorrectos.', 'INVALID_CREDENTIALS');
    }

    const admin = serializeAdmin(adminRow);
    const sessionId = randomUUID();
    const refreshToken = createRefreshToken(admin.id, sessionId);
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    await sheetsRepository.append('sessions', {
      id: sessionId,
      adminId: admin.id,
      refreshTokenHash: sha256(refreshToken),
      expiresAt,
      revokedAt: '',
      createdAt: now.toISOString(),
      lastUsedAt: now.toISOString()
    });

    return {
      admin,
      accessToken: createAccessToken(admin),
      refreshToken
    };
  }

  async refresh(refreshToken) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(401, 'La sesión expiró o es inválida.', 'INVALID_SESSION');
    }

    const session = await sheetsRepository.findById('sessions', payload.sid);
    if (!session || session.revokedAt || new Date(session.expiresAt) <= new Date()) {
      throw new HttpError(401, 'La sesión expiró o fue revocada.', 'SESSION_EXPIRED');
    }

    if (!constantTimeEqual(session.refreshTokenHash, sha256(refreshToken))) {
      await sheetsRepository.updateById('sessions', session.id, {
        revokedAt: new Date().toISOString()
      });
      throw new HttpError(401, 'Se detectó reutilización de sesión.', 'TOKEN_REUSE_DETECTED');
    }

    const adminRow = await sheetsRepository.findById('admins', payload.sub);
    if (!adminRow || !parseBoolean(adminRow.active)) {
      throw new HttpError(401, 'Administrador deshabilitado.', 'ADMIN_DISABLED');
    }

    const admin = serializeAdmin(adminRow);
    const newRefreshToken = createRefreshToken(admin.id, session.id);
    await sheetsRepository.updateById('sessions', session.id, {
      refreshTokenHash: sha256(newRefreshToken),
      lastUsedAt: new Date().toISOString()
    });

    return {
      admin,
      accessToken: createAccessToken(admin),
      refreshToken: newRefreshToken
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;
    try {
      const payload = verifyRefreshToken(refreshToken);
      await sheetsRepository.updateById('sessions', payload.sid, {
        revokedAt: new Date().toISOString()
      });
    } catch {
      // Cerrar sesión debe ser idempotente y no revelar detalles del token.
    }
  }

  verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
        issuer: ISSUER,
        audience: AUDIENCE
      });
      if (payload.type !== 'access') throw new Error('Tipo de token inválido');
      return payload;
    } catch {
      throw new HttpError(401, 'Token de acceso inválido o expirado.', 'INVALID_ACCESS_TOKEN');
    }
  }
}

export const authService = new AuthService();
