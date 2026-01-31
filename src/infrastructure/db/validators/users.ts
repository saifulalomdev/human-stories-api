import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from '../schema/users';

// --- Constants ---
const MIN_NAME_LEN = 3;
const MIN_PWD_LEN = 10;

// --- Base Schemas (The Foundation) ---
export const userBaseSchema = createSelectSchema(users, {
    // Cast 's' or use z.string().min() to override
    name: z.string().min(MIN_NAME_LEN, `Name must be at least ${MIN_NAME_LEN} characters`),
    password: z.string().min(MIN_PWD_LEN, `Password must be at least ${MIN_PWD_LEN} characters`),
    email: z.string().email("Invalid email address"),
});

// --- Logic-Specific Schemas ---

// Used for Registration
export const userRegistrationSchema = userBaseSchema.pick({
    name: true,
    email: true,
    password: true,
});

// Used for Login
export const userLoginSchema = userBaseSchema.pick({
    email: true,
    password: true,
});

// Used for Patching/Updating profile
export const userUpdateSchema = userBaseSchema.pick({
    name: true,
    email: true,
    password: true,
    isVerified: true
}).partial();

// --- DTOs (Data Transfer Objects) ---

// What the client sees (Public Profile)
export const userPublicSchema = userBaseSchema.omit({
    password: true,
    isVerified: true,
    updatedAt: true,
    createdAt: true
});

// --- Types ---
export type User = z.infer<typeof userBaseSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;

// Shared Wrapper Types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type LogInResponseBody = Prettify<{
    tokens: {
        accessToken: string;
        refreshToken: string;
    },
    user: UserPublic;
}>;