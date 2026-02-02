import bcrypt from 'bcrypt';
import JWT, { SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';
import { UserPublic } from '@/infrastructure/db';

const SALT_ROUND = 10;

// Centralized Token Configuration
const TOKEN_CONFIG = {
  access: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_SECRET_EXPIRES_IN as SignOptions['expiresIn'],
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_SECRET_EXPIRES_IN as SignOptions['expiresIn'],
  },
  reset: {
    secret: env.JWT_PASSWORD_RESET_SECRET,
    expiresIn: env.JWT_PASSWORD_RESET_SECRET_EXPIRES_IN as SignOptions['expiresIn'],
  },
};

// --- Generic Helpers ---

const signToken = (payload: object, type: keyof typeof TOKEN_CONFIG) => {
  const { secret, expiresIn } = TOKEN_CONFIG[type];
  return JWT.sign(payload, secret, { expiresIn });
};

const verifyToken = <T>(token: string, type: keyof typeof TOKEN_CONFIG): T | null => {
  try {
    return JWT.verify(token, TOKEN_CONFIG[type].secret) as T;
  } catch {
    return null;
  }
};

// --- Exported Auth Utilities ---

export const hashPassword = (p: string) => bcrypt.hash(p, SALT_ROUND);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

// Access Tokens
export const signAccessToken = (payload: UserPublic) => signToken({ ...payload }, 'access');
export const verifyAccessToken = (token: string) => verifyToken<UserPublic>(token, 'access');

// Reset Tokens
export const signResetToken = (userId: string) => signToken({ userId }, 'reset');
export const verifyResetToken = (token: string) => verifyToken<{ userId: string }>(token, 'reset');

// Refresh Tokens (Special case because of the 'jti' and 'expiresAt')
export const signRefreshToken = (payload: UserPublic) => {
  const jti = crypto.randomUUID();
  const token = signToken({ id: payload.id, jti }, 'refresh');
  const decoded = JWT.decode(token) as { exp: number };

  return {
    refreshToken: token,
    jti,
    expiresAt: new Date(decoded.exp * 1000),
  };
};

export const verifyRefreshToken = (token: string) => 
    verifyToken<{ id: string; jti: string }>(token, 'refresh');