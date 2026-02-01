// src/modules/auth/auth.docs.ts
import { userLoginSchema, userRegistrationSchema } from '@/infrastructure/db';
import { registry } from '@/infrastructure/open-api/generate-openapi';

const openApiLoginSchema = userLoginSchema.openapi('Login body', {
    description: 'Login payload for new users',
    example: { email: 'saiful@edmail.com', password: 'my strong password' }
});

const openApiUserRegistrationSchema = userRegistrationSchema.openapi('Register body', {
    description: 'Register payload for new users',
    example: {
        name: "Saiful Alom",
        email: 'saiful@edmail.com',
        password: 'my strong password'
    }
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

