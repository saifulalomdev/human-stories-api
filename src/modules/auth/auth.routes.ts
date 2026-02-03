// src/modules/auth/auth.routes.ts
import { otpSchema, userLoginSchema, userRegistrationSchema, jwt, email } from '@/infrastructure/db';
import { authController } from './auth.controller';
import { requireResetToken } from '@/infrastructure/http/middlewares';
import { createSmartRouter } from '@/infrastructure/http/smart-router';


const auth = createSmartRouter("Auth");

// --- Identity ---
auth.add({
    method: 'get',
    path: "/me",
    summary: "Get current profile",
    isProtected: true,
    controller: authController.getMe
});

// --- Session Management ---
auth.add({
    method: 'post',
    path: "/register",
    summary: "Register new user",
    schema: userRegistrationSchema,
    controller: authController.register
});

auth.add({
    method: 'post',
    path: "/login",
    summary: "Login",
    schema: userLoginSchema,
    controller: authController.login
});

auth.add({
    method: 'post',
    path: "/refresh",
    summary: "Refresh session",
    schema: jwt,
    controller: authController.refresh
});

auth.add({
    method: 'post',
    path: "/logout",
    summary: "Logout",
    schema: email,
    controller: authController.logout
});

// --- Recovery Flow ---
auth.add({
    method: 'post',
    path: "/forgot-pass",
    summary: "Request reset OTP",
    schema: email,
    controller: authController.forgotPassword
});

auth.add({
    method: 'post',
    path: "/verify-otp",
    summary: "Verify OTP code",
    schema: otpSchema,
    controller: authController.verifyOTP
});

auth.add({
    method: 'post',
    path: "/reset-pass",
    summary: "Reset password",
    controller: authController.resetPassword,
    extraMiddlewares: [requireResetToken()]
});

export default auth.instance;