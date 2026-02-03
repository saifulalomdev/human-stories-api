import { ZodTypeAny } from 'zod';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface ApiEndpoint {
    readonly path: string;
    readonly method: HttpMethod;
    readonly summary: string;
    readonly body?: ZodTypeAny; // Allows any Zod schema (object, array, etc.)
    readonly name?: string;     // Custom name for Swagger UI
    readonly isProtected?: boolean;
    readonly responseDescription?: string;
}