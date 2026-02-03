// @saifulalom.com/core -> src/http/smart-router.ts
import { Router, RequestHandler } from 'express';
import { registry } from '@/infrastructure/open-api/generate-openapi';
import { validateRequest, requireAuth } from '@/infrastructure/http/middlewares';
import { RouteConfig } from './types';

export function createSmartRouter(tag: string) {
    const router = Router();
    const normalizedTag = tag.toUpperCase();
    const apiPrefix = `/${tag.toLowerCase()}`;

    const add = (config: RouteConfig) => {
        const { method, path, controller, schema, isProtected, extraMiddlewares = [] } = config;
        const fullPath = `${apiPrefix}${path}`;

        // 1. Documentation (OpenAPI)
        registerDocs(normalizedTag, fullPath, config);

        // 2. Middleware Chain
        const chain: RequestHandler[] = [];

        if (isProtected) chain.push(requireAuth());
        if (schema) chain.push(validateRequest(schema));
        if (extraMiddlewares.length > 0) chain.push(...extraMiddlewares);

        // 3. Express Registration
        router[method](path, ...chain, controller);
    };

    return { instance: router, add };
}

/**
 * Handles the OpenAPI registry registration logic
 */
function registerDocs(tag: string, fullPath: string, config: RouteConfig) {
    const { method, summary, schema, isProtected } = config;

    registry.registerPath({
        path: fullPath,
        method,
        tags: [tag],
        summary,
        security: isProtected ? [{ bearerAuth: [] }] : undefined,
        request: schema ? {
            body: {
                content: {
                    'application/json': {
                        schema: (schema as any).openapi(`${tag}_${method}_${fullPath.replace(/\//g, '_')}`)
                    }
                }
            }
        } : undefined,
        responses: { 200: { description: "Success" } }
    });
}