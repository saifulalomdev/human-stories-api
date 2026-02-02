// src/modules/auth/auth.docs.ts
import { email, jwt, otpSchema, userLoginSchema, userRegistrationSchema } from '@/infrastructure/db';
import { registry } from '@/infrastructure/open-api/generate-openapi';

const openApiUserRegistrationSchema = userRegistrationSchema.openapi('Register body', {
    description: 'Register payload for new users',
    example: {
        name: "Saiful Alom",
        email: 'saiful@edmail.com',
        password: 'my strong password'
    }
});

registry.registerPath({
    path: "/auth/register",
    method: "post",
    tags: ["Auth"],
    description: "Register user account",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openApiUserRegistrationSchema
                }
            }
        }
    },
    responses: {
        201: { description: "Register successfully" },
        401: { description: "Invalid email or password" },
        409: { description: "Email alredy registerd or may has a conflict" },
    },
});

const openApiLoginSchema = userLoginSchema.openapi('Login body', {
    description: 'Login payload for new users',
    example: { email: 'saiful@edmail.com', password: 'my strong password' }
});

registry.registerPath({
    path: "/auth/login",
    method: "post",
    tags: ["Auth"],
    description: "Login user account",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openApiLoginSchema
                }
            }
        }
    },
    responses: {
        200: { description: "Login successfully" },
        401: { description: "Invalid email or password" },
    },
});

// open 
const openApiJwtlogout = jwt.openapi('Logout token body', {
    description: 'Refresh jwt access token',
    example: {
        refreshToken: "jwt refress token"
    }
});
registry.registerPath({
    path: "/auth/logout",
    method: "post",
    tags: ["Auth"],
    description: "Login user account",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openApiJwtlogout
                }
            }
        }
    },
    responses: {
        200: { description: "Login successfully" },
        401: { description: "Invalid email or password" },
    },
});



// open 
const openApiJwt = jwt.openapi('Refress token body', {
    description: 'Refresh jwt access token',
    example: {
        refreshToken: "jwt refress token"
    }
});

registry.registerPath({
    path: "/auth/refresh",
    method: "post",
    tags: ["Auth"],
    description: "Register user account",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: openApiJwt
                }
            }
        }
    },
    responses: {
        201: { description: "Register successfully" },
        401: { description: "Invalid email or password" },
        409: { description: "Email alredy registerd or may has a conflict" },
    },
});


// Define a schema for the User profile response
const userProfileSchema = userRegistrationSchema.omit({ password: true }).openapi('UserProfile', {
    description: 'The current user profile information',
});

registry.registerPath({
    path: "/auth/me",
    method: "get",
    tags: ["Auth"],
    summary: "Get current user profile",
    security: [{ bearerAuth: [] }], // <--- This enables the "Lock" icon in Swagger
    responses: {
        200: {
            description: "User profile retrieved successfully"
        },
        401: { description: "Unauthorized - Missing or invalid token" },
    },
});

registry.registerPath({
    path: "/auth/forgot-password",
    method: "post",
    tags: ["Auth"],
    summary: "Get current user profile",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: email.openapi("Forgot password body", {
                        example: { email: "saiful@saifulalom.com" }
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: "User profile retrieved successfully"
        },
        401: { description: "Unauthorized - Missing or invalid token" },
    },
});

registry.registerPath({
    path: "/auth/verify-otp",
    method: "post",
    tags: ["Auth"],
    summary: "Verify otp",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: otpSchema.openapi("OTP request body", {
                        example: { email: "user@emai.com", code: "123456" }
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: "User profile retrieved successfully"
        },
        401: { description: "Unauthorized - Missing or invalid token" },
    },
});