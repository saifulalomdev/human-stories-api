// @saifulalom.com/core -> src/http/types.ts
import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export interface RouteConfig {
    method: HttpMethod;
    path: string;
    summary: string;
    controller: RequestHandler;
    schema?: ZodTypeAny;
    isProtected?: boolean;
    extraMiddlewares?: RequestHandler[];
}