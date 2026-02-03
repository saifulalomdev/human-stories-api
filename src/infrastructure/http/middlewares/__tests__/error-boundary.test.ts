import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorBoundary } from '../error-boundary';
import { AppError } from '@/core';

// Create a dummy app to test the middleware
const app = express();
app.use(express.json());

// Dummy routes to trigger different errors
app.get('/app-error', () => {
  throw new AppError("Unauthorized access", 401);
});

app.get('/db-error', () => {
  const err: any = new Error("Unique constraint");
  err.code = '23505';
  throw err;
});

app.get('/crash', () => {
  throw new Error("Something exploded!");
});

// Attach the middleware we are testing
app.use(errorBoundary);

describe('ErrorBoundary Middleware', () => {
  it('should return 401 for a known AppError', async () => {
    const response = await request(app).get('/app-error');
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized access");
    expect(response.body.success).toBe(false);
  });

  it('should return 409 for database unique constraint (23505)', async () => {
    const response = await request(app).get('/db-error');
    
    expect(response.status).toBe(409);
    expect(response.body.message).toContain("already exists");
  });

  it('should return 500 for unknown system crashes', async () => {
    const response = await request(app).get('/crash');
    
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});