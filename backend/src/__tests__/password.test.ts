import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/password';

describe('Password utilities', () => {
  it('hashes a password and verifies it', async () => {
    const password = 'mysecurepassword';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await comparePassword(password, hash)).toBe(true);
  });

  it('rejects wrong password', async () => {
    const hash = await hashPassword('correct');
    expect(await comparePassword('wrong', hash)).toBe(false);
  });

  it('produces different hashes for same password (salt)', async () => {
    const h1 = await hashPassword('same');
    const h2 = await hashPassword('same');
    expect(h1).not.toBe(h2);
  });
});
