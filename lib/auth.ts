import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@wasstripsvergelijker.nl';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''; // bcrypt hash
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function validateAdmin(email: string, password: string): Promise<boolean> {
  if (email !== ADMIN_EMAIL) return false;
  
  // For development, allow a default password if no hash is set
  if (!ADMIN_PASSWORD_HASH && process.env.NODE_ENV === 'development') {
    return password === 'admin123'; // Change this in production!
  }
  
  return await compare(password, ADMIN_PASSWORD_HASH);
}

export function generateToken(email: string): string {
  return sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Helper to generate password hash for setup
export async function generatePasswordHash(password: string): Promise<string> {
  return await hash(password, 10);
}