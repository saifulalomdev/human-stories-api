// src/modules/auth/auth.controller.ts

import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@/core';
import { authService } from './auth.service';
import { UserLogin, UserRegistration } from '@/infrastructure/db';

export const authController = {
    /**
     * Path: POST /auth/register
     */
    async register(
        req: Request<object, object, UserRegistration>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const newUser = await authService.createUserAccount(req.body);
            return sendResponse(res, 201, "User registered successfully", true, newUser);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Path: POST /auth/login
     */
    async login(
        req: Request<object, object, UserLogin>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await authService.authenticateUser(req.body);

            return sendResponse(res, 200, "User login successfully", true, result);
        } catch (error) {
            next(error);
        }
    },
    /**
     * Path: GET /auth/me
     */
    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            // req.user is populated by requireAuth middleware
            const userId = req.user.id;

            const user = await authService.getCurrentUser(userId);

            return sendResponse(res, 200, "User profile retrieved", true, user);
        } catch (error) {
            next(error);
        }
    },
    async refresh(req: Request<{}, {}, { refreshToken: string }>, res: Response, next: NextFunction) {
        try {
            
            // Get the token from the secure cookie
            const { refreshToken } = req.body;
            const result = await authService.refreshAccessToken(refreshToken);

            return sendResponse(res, 200, "Token refreshed successfully", true, result);
        } catch (error) {
            next(error);
        }
    },
    async logout(req: Request<{}, {}, { refreshToken: string }>, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);

        return sendResponse(res, 200, "Logged out successfully", true);
    } catch (error) {
        next(error);
    }
}
};