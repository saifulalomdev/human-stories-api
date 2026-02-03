// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth, requireResetToken, validateBody } from '@/infrastructure/http/middlewares';
import { otpSchema, userLoginSchema, userRegistrationSchema, jwt, email } from '@/infrastructure/db';


export default Router()
    // 1. Identity
    .get("/me", requireAuth(), authController.getMe)

    // 2. Session Management
    .post("/register", validateBody(userRegistrationSchema), authController.register)
    .post("/login", validateBody(userLoginSchema), authController.login)
    .post("/refresh", validateBody(jwt), authController.refresh)
    .post("/logout", validateBody(email), authController.logout)

    // 3. Recovery Flow
    .post("/forgot-pass", validateBody(email), authController.forgotPassword)
    .post("/verify-otp", validateBody(otpSchema), authController.verifyOTP)
    .post("/reset-pass", requireResetToken(), authController.resetPassword);