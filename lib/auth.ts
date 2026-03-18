import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { BCRYPT_ROUNDS, JWT_EXPIRY } from './constants';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

/** Throws a clear error when a required env var is missing, preventing silent failures. */
function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/**
 * Validates admin credentials against the env-configured email and bcrypt password hash.
 * Throws if ADMIN_EMAIL or ADMIN_PASSWORD_HASH env vars are not set.
 */
export async function validateAdmin(email: string, password: string): Promise<boolean> {
  const adminEmail = requireEnv('ADMIN_EMAIL', ADMIN_EMAIL);
  const adminHash = requireEnv('ADMIN_PASSWORD_HASH', ADMIN_PASSWORD_HASH);

  if (email !== adminEmail) return false;
  return await compare(password, adminHash);
}

/**
 * Generates a signed JWT for the given admin email.
 * Token expires after JWT_EXPIRY (see constants.ts).
 * Throws if JWT_SECRET env var is not set.
 */
export function generateToken(email: string): string {
  return sign({ email, role: 'admin' }, requireEnv('JWT_SECRET', JWT_SECRET), { expiresIn: JWT_EXPIRY });
}

/**
 * Verifies a JWT and returns its payload, or null if invalid/expired.
 * Throws if JWT_SECRET env var is not set.
 */
export function verifyToken(token: string): any {
  try {
    return verify(token, requireEnv('JWT_SECRET', JWT_SECRET));
  } catch {
    return null;
  }
}

/**
 * Hashes a plain-text password using bcrypt.
 * Use this once during admin setup to generate ADMIN_PASSWORD_HASH.
 */
export async function generatePasswordHash(password: string): Promise<string> {
  return await hash(password, BCRYPT_ROUNDS);
}
