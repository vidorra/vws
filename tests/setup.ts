// Set required env vars for tests
process.env.ADMIN_EMAIL = 'test@example.com';
process.env.ADMIN_PASSWORD_HASH = '$2b$10$IHiFW8AWC4bx97UgoiZS8OXi6eLJ4mhbeUg0ZapW/tV3LkR.ZajHK'; // bcrypt of "testpassword"
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
