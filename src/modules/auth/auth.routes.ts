// src/modules/auth/auth.routes.ts
import { authController } from './auth.controller';
import { requireResetToken } from '@/infrastructure/http/middlewares';
import { otpSchema, userLoginSchema, userRegistrationSchema, jwt, email } from '@/infrastructure/db';
import { RouteConfig } from '@/infrastructure/http/types';
import { createSmartRouter } from '@/infrastructure/http/smart-router';

const auth = createSmartRouter("Auth");

// 1. Identity Group
const identityRoutes: RouteConfig[] = [
    { method: 'get', path: "/me", summary: "Get profile", isProtected: true, controller: authController.getMe }
];

// 2. Session Management Group
const sessionRoutes: RouteConfig[] = [
    { method: 'post', path: "/register", summary: "Register", schema: userRegistrationSchema, controller: authController.register },
    { method: 'post', path: "/login", summary: "Login", schema: userLoginSchema, controller: authController.login },
    { method: 'post', path: "/refresh", summary: "Refresh", schema: jwt, controller: authController.refresh },
    { method: 'post', path: "/logout", summary: "Logout", schema: email, controller: authController.logout },
];

// 3. Recovery Flow Group
const recoveryRoutes: RouteConfig[] = [
    { method: 'post', path: "/forgot-pass", summary: "Forgot Pass", schema: email, controller: authController.forgotPassword },
    { method: 'post', path: "/verify-otp", summary: "Verify OTP", schema: otpSchema, controller: authController.verifyOTP },
    { method: 'post', path: "/reset-pass", summary: "Reset Pass", controller: authController.resetPassword, extraMiddlewares: [requireResetToken()] },
];

[...identityRoutes, ...sessionRoutes, ...recoveryRoutes].forEach(route => auth.add(route));

export default auth.instance;