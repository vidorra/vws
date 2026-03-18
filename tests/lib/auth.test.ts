import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock bcryptjs before importing auth
vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(() => 'mock.jwt.token'),
  verify: vi.fn(),
}));

import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import {
  validateAdmin,
  generateToken,
  verifyToken,
  generatePasswordHash,
} from '@/lib/auth';

const mockCompare = vi.mocked(compare);
const mockHash = vi.mocked(hash);
const mockSign = vi.mocked(sign);
const mockVerify = vi.mocked(verify);

describe('validateAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when email does not match', async () => {
    const result = await validateAdmin('wrong@example.com', 'anypassword');
    expect(result).toBe(false);
    expect(mockCompare).not.toHaveBeenCalled();
  });

  it('returns true when email and password are correct', async () => {
    mockCompare.mockResolvedValue(true as never);
    const result = await validateAdmin('test@example.com', 'testpassword');
    expect(result).toBe(true);
    expect(mockCompare).toHaveBeenCalledOnce();
  });

  it('returns false when password is incorrect', async () => {
    mockCompare.mockResolvedValue(false as never);
    const result = await validateAdmin('test@example.com', 'wrongpassword');
    expect(result).toBe(false);
  });

  it('throws when ADMIN_EMAIL env var is missing', async () => {
    const original = process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_EMAIL;
    await expect(validateAdmin('test@example.com', 'pw')).rejects.toThrow(
      'Missing required environment variable: ADMIN_EMAIL'
    );
    process.env.ADMIN_EMAIL = original;
  });

  it('throws when ADMIN_PASSWORD_HASH env var is missing', async () => {
    const original = process.env.ADMIN_PASSWORD_HASH;
    delete process.env.ADMIN_PASSWORD_HASH;
    await expect(validateAdmin('test@example.com', 'pw')).rejects.toThrow(
      'Missing required environment variable: ADMIN_PASSWORD_HASH'
    );
    process.env.ADMIN_PASSWORD_HASH = original;
  });
});

describe('generateToken', () => {
  it('calls sign with email and role', () => {
    generateToken('test@example.com');
    expect(mockSign).toHaveBeenCalledWith(
      { email: 'test@example.com', role: 'admin' },
      'test-jwt-secret-for-unit-tests',
      { expiresIn: '24h' }
    );
  });

  it('throws when JWT_SECRET is missing', () => {
    const original = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    expect(() => generateToken('test@example.com')).toThrow(
      'Missing required environment variable: JWT_SECRET'
    );
    process.env.JWT_SECRET = original;
  });
});

describe('verifyToken', () => {
  it('returns payload when token is valid', () => {
    const payload = { email: 'test@example.com', role: 'admin' };
    mockVerify.mockReturnValue(payload as never);
    const result = verifyToken('valid.token');
    expect(result).toEqual(payload);
  });

  it('returns null when token is invalid', () => {
    mockVerify.mockImplementation(() => { throw new Error('invalid token'); });
    const result = verifyToken('bad.token');
    expect(result).toBeNull();
  });
});

describe('generatePasswordHash', () => {
  it('calls bcrypt hash with 10 rounds', async () => {
    mockHash.mockResolvedValue('hashed' as never);
    await generatePasswordHash('mypassword');
    expect(mockHash).toHaveBeenCalledWith('mypassword', 10);
  });
});
