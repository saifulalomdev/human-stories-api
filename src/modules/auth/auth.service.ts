import type { AuthResponse, InsertUser } from "./auth.validator.js";
import { userRepo } from "./user.repo.js";
import { AppError } from '@/lib/app-error.js';
import { signJwtToken } from './auth.utils.js';

export const authService = {
    registerAccount: async (userData: InsertUser): Promise<AuthResponse> => {
        // 1. Check if user exists
        const userExist = await userRepo.findByEmail(userData.email);
        if (userExist) {
            throw new AppError("This email is already register", 409);
        }

        // 3. Create user
        const { id, name, email } = await userRepo.create(userData);

        // 4. Generate Token
        const accessToken = await signJwtToken(id)

        return { user: { name, email }, accessToken };
    },

    login: async (credentials: { email: string }): Promise<AuthResponse> => {
        const user = await userRepo.findByEmail(credentials.email);

        if (!user) {
            throw new AppError("This email is not registered", 404);
        }
        const { id, name, email } = user
        // 🚀 Generate Access Token
        const accessToken = await signJwtToken(id)

        return { user: { name, email }, accessToken };
    }
};