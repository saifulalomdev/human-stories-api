// src/modules/auth/auth.service.ts

import {
    type UserRegistration,
    UserLogin,
    UserPublic,
    LogInResponseBody,
    userRepository
} from '@/infrastructure/db';
import { AppError } from '@/core';
import { generateTokens, hashPassword, verifyPassword } from './auth.utils';


export const authService = {
    /**
     * Service to handle new user registration.
     */
    async createUserAccount(data: UserRegistration) {
        const { email, password, name } = data;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser?.isVerified) {
            throw new AppError("Email is already registered and verified", 409);
        }

        const securePassword = await hashPassword(password);

        const newUser = await userRepository.create({
            email,
            name,
            password: securePassword
        });

        // TO-DO: add email verification logic here later
        const verifiedUser = await userRepository.updateById(newUser.id, { isVerified: true });

        if (!verifiedUser) throw new AppError("Failed to update user", 500);

        return this.mapToPublicUser(verifiedUser);
    },

    /**
     * Service to handle user login.
     */
    async authenticateUser(data: UserLogin): Promise<LogInResponseBody> {
        const { email, password } = data;

        const existingUser = await userRepository.findByEmail(email);

        if (!existingUser) {
            throw new AppError("Email is not registered.", 404);
        }

        if (!existingUser.isVerified) {
            throw new AppError("Please verify your email before logging in.", 401);
        }

        const matchPassword = await verifyPassword(password, existingUser.password);
        if (!matchPassword) {
            throw new AppError("Wrong credentials.", 403);
        }

        const user = this.mapToPublicUser(existingUser);
        const tokens = generateTokens(user);

        return { tokens, user };
    },

    async getCurrentUser(userId: string): Promise<UserPublic> {
        // 1. Fetch from repository
        const user = await userRepository.findById(userId);

        // 2. Security check (in case user was deleted but token is still valid)
        if (!user) {
            throw new AppError("User account no longer exists.", 404);
        }

        // 3. Return formatted public data
        return this.mapToPublicUser(user);
    },
    /**
     * Helper to ensure consistency when sending user data to client
     */
    mapToPublicUser(user: any): UserPublic {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
};