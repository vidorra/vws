import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock auth module
vi.mock('@/lib/auth', () => ({
  validateAdmin: vi.fn(),
  generateToken: vi.fn(() => 'mock.jwt.token'),
}));

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { validateAdmin, generateToken } from '@/lib/auth';
import { POST } from '@/app/api/admin/login/route';
import { NextRequest } from 'next/server';

const mockValidateAdmin = vi.mocked(validateAdmin);
const mockGenerateToken = vi.mocked(generateToken);

function createLoginRequest(body: object): NextRequest {
  return new NextRequest(new URL('/api/admin/login', 'http://localhost:3000'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('POST /api/admin/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns token on valid credentials', async () => {
    mockValidateAdmin.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue('valid.jwt.token');

    const response = await POST(createLoginRequest({
      email: 'test@example.com',
      password: 'correctpassword',
    }));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.token).toBe('valid.jwt.token');
    expect(mockValidateAdmin).toHaveBeenCalledWith('test@example.com', 'correctpassword');
  });

  it('returns 401 on invalid credentials', async () => {
    mockValidateAdmin.mockResolvedValue(false);

    const response = await POST(createLoginRequest({
      email: 'test@example.com',
      password: 'wrongpassword',
    }));

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('returns 400 on invalid email format', async () => {
    const response = await POST(createLoginRequest({
      email: 'not-an-email',
      password: 'password',
    }));

    expect(response.status).toBe(400);
    expect(mockValidateAdmin).not.toHaveBeenCalled();
  });

  it('returns 400 on empty password', async () => {
    const response = await POST(createLoginRequest({
      email: 'test@example.com',
      password: '',
    }));

    expect(response.status).toBe(400);
  });

  it('returns 400 on missing fields', async () => {
    const response = await POST(createLoginRequest({}));

    expect(response.status).toBe(400);
  });
});
