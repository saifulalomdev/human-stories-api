// src/infrastructure/db/repositories/__tests__/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { userRepository } from '../users';
import { db } from '../../db';
import { users } from '../../schema/users';
import { eq } from 'drizzle-orm';

describe('UserRepository Integration Tests', () => {
  
  // Clean up the table before we start the suite
  beforeAll(async () => {
    await db.delete(users);
  });

  // Optional: Clean up after each test to keep data isolated
  afterAll(async () => {
    await db.delete(users);
  });

  const testUser = {
    name: 'Real DB User',
    email: 'realtest@example.com',
    password: 'securepassword123',
  };

  it('should physically insert a user into the database', async () => {
    const created = await userRepository.create(testUser);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.email).toBe(testUser.email);

    // Verify it actually exists by manual query
    const manualCheck = await db.select().from(users).where(eq(users.id, created.id));
    expect(manualCheck.length).toBe(1);
  });

  it('should find the user by email from the real table', async () => {
    const found = await userRepository.findByEmail(testUser.email);
    expect(found).not.toBeNull();
    expect(found?.name).toBe(testUser.name);
  });

  it('should return null for a non-existent email', async () => {
    const found = await userRepository.findByEmail('missing@example.com');
    expect(found).toBeNull();
  });

  it('should update the name in the database', async () => {
    // 1. Get user
    const existing = await userRepository.findByEmail(testUser.email);
    
    // 2. Update
    const updated = await userRepository.updateById(existing!.id, { name: 'Updated Name' });
    
    expect(updated?.name).toBe('Updated Name');
  });
});