import { sign } from 'hono/jwt';
import { env } from '@/config/env.js';
import type { InsertUser } from "./auth.validator.js";
import { userRepo } from "./user.repo.js";
import { AppError } from '@/lib/app-error.js';

export const authService = {
    registerAccount: async (userData: InsertUser) => {
        // 1. Check if user exists
        const userExist = await userRepo.findByEmail(userData.email);
        if (userExist) {
            throw new AppError("This email is already taken", 409);
        }

        // 3. Create user
        const newUser = await userRepo.create(userData);

        const tokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7

        // 4. Generate Token
        const accessToken = await sign({
            id: newUser.id,
            exp: tokenExp
        }, env.JWT_ACCESS_SECRET);

        return { user: newUser, accessToken };
    },

    login: async (credentials: { email: string }) => {
        const user = await userRepo.findByEmail(credentials.email);

        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        // 🚀 Generate Access Token
        const token = await sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, env.JWT_ACCESS_SECRET);

        return { user, token };
    }
};