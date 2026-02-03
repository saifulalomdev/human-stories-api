// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth, requireResetToken, validateRequest } from '@/infrastructure/http/middlewares';
import { otpSchema, userLoginSchema, userRegistrationSchema, jwt, email } from '@/infrastructure/db';

export default Router()
    // 1. Identity
    .get("/me", requireAuth(), authController.getMe)

    // 2. Session Management
    .post("/register", validateRequest(userRegistrationSchema), authController.register)
    .post("/login", validateRequest(userLoginSchema), authController.login)
    .post("/refresh", validateRequest(jwt), authController.refresh)
    .post("/logout", validateRequest(email), authController.logout)

    // 3. Recovery Flow
    .post("/forgot-pass", validateRequest(email), authController.forgotPassword)
    .post("/verify-otp", validateRequest(otpSchema), authController.verifyOTP)
    .post("/reset-pass", requireResetToken(), authController.resetPassword);