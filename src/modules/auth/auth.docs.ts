// src/modules/auth/auth.docs.ts
import { userLoginSchema } from '@/infrastructure/db';
import { registry } from '@/infrastructure/open-api/generate-openapi';

export const openApiLoginSchema = userLoginSchema.openapi('Login body', {
    description: 'Login payload for new users',
    example: { email: 'saiful@edmail.com', password: 'my strong password' }
});

registry.registerPath({
    path: "/auth/login",
    method: "post",
    tags: ["Auth"],
    description: "Reggiester user account",
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
        200: { description: "Sign up successfully" },
        401: { description: "Invalid email or password" },
        409: { description: "Email alredy registerd or may has a conflict" },
    },
})