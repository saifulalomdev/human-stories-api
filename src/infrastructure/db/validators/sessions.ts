import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { UserPublic } from './users';
import { sessions } from '../schema/session';

// --- Base Schemas ---
export const sessionBaseSchema = createSelectSchema(sessions, {
    // Override specific fields if needed
    id: z.string().uuid(),
    userId: z.string().uuid(),
    expiresAt: z.date(),
});

// --- Logic-Specific Schemas ---

// Used when creating a session record in the DB
export const sessionCreateSchema = sessionBaseSchema.pick({
    id: true,
    userId: true,
    expiresAt: true,
});

// --- Types ---
export type Session = z.infer<typeof sessionBaseSchema>;
export type SessionCreate = z.infer<typeof sessionCreateSchema>;

/**
 * The structure of the data encoded inside the Refresh Token JWT.
 * 'sub' (subject) is the standard JWT claim for the User ID.
 * 'jti' (JWT ID) is our unique Session ID stored in the DB.
 */
export type RefreshTokenPayload = {
    id: string;    // The User ID
    jti: string;   // The unique Session ID (Primary Key in sessions table)
    iat: number;   // Issued At (Unix timestamp in seconds)
    exp: number;   // Expiration (Unix timestamp in seconds)
};