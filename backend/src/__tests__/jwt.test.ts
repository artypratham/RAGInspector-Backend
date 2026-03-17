import { describe, it, expect } from 'vitest';

// Mock env before importing jwt module
import { vi } from 'vitest';
vi.mock('../config/env', () => ({
  env: {
    JWT_SECRET: 'a'.repeat(32),
    PORT: 5000,
    NODE_ENV: 'test',
    DATABASE_URL: 'postgresql://test',
    FRONTEND_URL: 'http://localhost:5173',
  },
}));

import { generateToken, verifyToken } from '../utils/jwt';

describe('JWT utilities', () => {
  it('generates a token and verifies it', () => {
    const payload = { userId: 'user-123', email: 'test@example.com' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe('user-123');
    expect(decoded.email).toBe('test@example.com');
  });

  it('throws on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow('Invalid or expired token');
  });

  it('throws on tampered token', () => {
    const token = generateToken({ userId: 'user-1', email: 'a@b.com' });
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(() => verifyToken(tampered)).toThrow('Invalid or expired token');
  });
});
