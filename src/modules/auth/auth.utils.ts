// apps/api/src/modules/auth/auth.utils.ts
import bcrypt from 'bcrypt';
import JWT, { SignOptions } from 'jsonwebtoken'; // Import SignOptions
import { env } from '@/config/env';
import { UserPublic } from '@/infrastructure/db';


const SALT_ROUND = 10;
const ACCESS_TOKEN_SECRET = env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_REFRESH_SECRET;

// Ensure these are cast to the specific type JWT expects
const ACCESS_TOKEN_EXIRES_IN = (env.JWT_ACCESS_SECRET_EXIRES_IN || "10m") as SignOptions['expiresIn'];
const REFRESH_TOKEN_EXIRES_IN = (env.JWT_REFRESH_SECRET_EXIRES_IN || "15d") as SignOptions['expiresIn'];

export type DecodedPayload = UserPublic & { iat: number; exp: number };

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUND);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export const generateTokens = (payload: UserPublic) => {
    // 1. Create a plain object. JWT.sign fails if the payload 
    // is a class instance or has hidden Zod properties.
    const jwtPayload = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
    };

    const accessToken = JWT.sign(jwtPayload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXIRES_IN,
    });

    const refreshToken = JWT.sign(jwtPayload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXIRES_IN,
    });

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    try {
        return JWT.verify(token, ACCESS_TOKEN_SECRET) as DecodedPayload;
    } catch (error) {
        return null;
    }
};