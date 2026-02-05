import { sign } from 'hono/jwt';
import { env } from "@/config/env.js";

export async function signJwtToken(userId: string) {
    
    const tokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

    const token = await sign({ id: userId, exp: tokenExp }, env.JWT_SECRET);

    return token
}