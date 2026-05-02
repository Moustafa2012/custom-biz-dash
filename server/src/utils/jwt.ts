import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32 || JWT_SECRET === 'your-secret-key' || JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  throw new Error(
    'FATAL: JWT_SECRET environment variable is missing, too short (<32 chars), or set to a known placeholder. ' +
    'Generate a strong secret with: openssl rand -hex 64'
  );
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  is2FATemp?: boolean;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};
