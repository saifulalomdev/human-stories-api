// src/infrastructure/open-api/register-path.ts
import { registry } from './generate-openapi';
import { ApiEndpoint } from './types';

export const registerOpenApiPath = (tag: string, endpoints: readonly ApiEndpoint[]) => {
    endpoints.forEach((endpoint) => {
        const { path, method, summary, body, name, isProtected, responseDescription } = endpoint;

        registry.registerPath({
            path,
            method,
            tags: [tag],
            summary,
            security: isProtected ? [{ bearerAuth: [] }] : undefined,
            
            // 2. Setup Request Body only if it exists
            request: body ? {
                body: {
                    content: {
                        'application/json': { 
                            schema: body.openapi(name ?? `${path.split('/').pop()}Body`) 
                        }
                    }
                }
            } : undefined,

            // 3. Setup Standardized Responses
            responses: {
                [method === 'post' ? 201 : 200]: { 
                    description: responseDescription || "Success" 
                },
                400: { description: "Validation Error" },
                401: { description: "Unauthorized" },
                500: { description: "Internal Server Error" }
            }
        });
    });
};