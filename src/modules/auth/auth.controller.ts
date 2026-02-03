// src/modules/auth/auth.controller.ts
import { authService } from './auth.service';
import { action } from '@/infrastructure/http';

export const authController = {
    
    // 1. Basic CRUD/Auth actions
    register: action((req) => authService.createUserAccount(req.body), "User account created successfully", 201),
    
    login: action((req) => authService.authenticateUser(req.body), "User login successfully"),

    getMe: action((req) => authService.getCurrentUser(req.user.id), "User profile retrieved"),
    
    refresh: action((req) => authService.refreshAccessToken(req.body.refreshToken), "Token refreshed successfully"),

    // 2. Refactored Logout (No return data needed)
    logout: action((req) => authService.logout(req.body.refreshToken), "Logged out successfully"),

    // 3. Refactored Password Flow
    forgotPassword: action((req) => authService.requestPasswordReset(req.body.email), "If account exists, an OTP has been sent."),

    verifyOTP: action((req) => authService.verifyResetOTP(req.body.email, req.body.code), "OTP verified"),

    resetPassword: action((req) => authService.completePasswordReset(req.user.id, req.body.password), "Password updated successfully")
};