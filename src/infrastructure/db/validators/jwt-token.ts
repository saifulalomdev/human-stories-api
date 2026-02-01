// src/db/validators.ts
import z from 'zod';

export const jwt = z.object({
    refreshToken: z.jwt()
})