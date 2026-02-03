// src/modules/auth/auth.docs.ts
import { email, otpSchema, userLoginSchema, userRegistrationSchema } from '@/infrastructure/db';
import { registerOpenApiPath } from '@/infrastructure/open-api/register-path';

const authEndpoints = [
    { path: "/auth/register",    method: "post", summary: "Register account", body: userRegistrationSchema, name: "RegisterBody" },
    { path: "/auth/login",       method: "post", summary: "Login session",    body: userLoginSchema,        name: "LoginBody" },
    { path: "/auth/me",          method: "get",  summary: "Get profile",      isProtected: true },
    { path: "/auth/forgot-pass", method: "post", summary: "Request OTP",      body: email,                  name: "EmailBody" },
    { path: "/auth/verify-otp",  method: "post", summary: "Verify OTP",       body: otpSchema,              name: "OTPBody" },
] as const;

// Register everything in one line
registerOpenApiPath("Auth", authEndpoints);