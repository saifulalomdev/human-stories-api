// src/modules/auth/auth.routes.ts
import { authResponse, userLoginSchema, userRegisterSchema } from "./auth.validator.js";
import { createRoute } from "@hono/zod-openapi";

export const registerRoute = createRoute({
    tags: ["Auth"],
    summary: "Register account",
    method: "post",
    path: "/register",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: userRegisterSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "User account register successfully",
            content: {
                "application/json": {
                    schema: authResponse
                }
            }
        },
        409: { description: "This email is already registered" }


    }

});


export const loginRoute = createRoute({
    tags: ["Auth"],
    summary: "Login",
    method: "post",
    path: "/login",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: userLoginSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "User login",
            content: {
                "application/json": {
                    schema: authResponse
                }
            }
        }
    },
})