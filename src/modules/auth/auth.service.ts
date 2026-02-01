// src/modules/auth/auth.service.ts

import {
    type UserRegistration,
    UserLogin,
    UserPublic,
    LogInResponseBody,
    userRepository
} from '@/infrastructure/db';
import { AppError } from '@/core';
import {
    hashPassword,
    signAccessToken,
    signRefreshToken,
    verifyPassword,
    verifyRefreshToken
} from './auth.utils';
import { sessionsRepository } from '@/infrastructure/db/repositories/sessions';


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
        const accessToken = signAccessToken(user);
        const { refreshToken, jti, expiresAt } = signRefreshToken(user);

        // save refresh token metadata
        await sessionsRepository.create({ expiresAt, id: jti, userId: user.id })

        return { tokens: { accessToken, refreshToken }, user };
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
 * Service to issue a new Access Token using a valid Refresh Token
 */
    async refreshAccessToken(token: string): Promise<{ accessToken: string }> {

        if (!token) {
            throw new AppError("Refresh token missing.", 401);
        }
        // 1. Verify the JWT signature and structure
        const decoded = verifyRefreshToken(token); // You'll need this helper in utils
        if (!decoded) {
            throw new AppError("Invalid or expired refresh token.", 401);
        }

        // 2. Check the Database to see if the session is still valid/active
        const session = await sessionsRepository.findValidSession(decoded.jti);
        if (!session) {
            throw new AppError("Session has been revoked or expired.", 401);
        }

        // 3. Get the user to ensure they still exist
        const user = await userRepository.findById(decoded.id);
        if (!user) {
            throw new AppError("User no longer exists.", 404);
        }

        // 4. Generate only a NEW Access Token
        const accessToken = signAccessToken(this.mapToPublicUser(user));

        return { accessToken };
    },
    async logout(refreshToken: string) {
        if (!refreshToken) return; // Already "logged out" if no token exists

        // 1. Verify and decode the refresh token to get the JTI
        const decoded = verifyRefreshToken(refreshToken);

        if (decoded && decoded.jti) {
            // 2. Delete the session from the database
            await sessionsRepository.deleteSession(decoded.jti);
        }

        return null;
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