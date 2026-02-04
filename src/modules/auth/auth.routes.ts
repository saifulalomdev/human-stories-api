// src/modules/auth/auth.routes.ts
import { apiRotue } from "@/lib/router.js";
import { authResponse, userLoginSchema, userRegisterSchema } from "./auth.validator.js";

export const registerRoute = apiRotue({
    tag: "Auth",
    method: "post",
    path: "/register",
    response: authResponse,
    summary: "Register account",
    body: userRegisterSchema,
    status: 201
})

export const loginRoute = apiRotue({
    tag: "Auth",
    method: "post",
    path: "/login",
    response: authResponse,
    summary: "Login",
    body: userLoginSchema,
    status: 200
})