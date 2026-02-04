import { createRoute, z , RouteConfig} from '@hono/zod-openapi';

interface ApiRotue {
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  tag: string,
  summary: string,
  body?: z.ZodSchema,
  response: z.ZodSchema,
  status?: number
}

// 1. Unified Error Schema
const ErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  error: z.string().openapi({ example: "Detailed error message" }),
});

// 2. Centralized Global Responses
const commonResponses = {
  400: { description: 'Validation Error', content: { 'application/json': { schema: ErrorSchema } } },
  401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  404: { description: 'Not Found', content: { 'application/json': { schema: ErrorSchema } } },
};

// 🛡️ THE ONLY BASE YOU NEED
export function apiRotue({ method, path, tag, summary, body, response, status = 200 }: ApiRotue) {
  return createRoute({
    method,
    path,
    summary,
    tags: [tag],
    security: [{ Bearer: [] }],
    request: body ? {
      body: { content: { 'application/json': { schema: body } } },
    } : undefined,
    responses: {
      [status]: {
        description: 'Success',
        content: { 'application/json': { schema: response } },
      },
      ...commonResponses,
    },
  })  as RouteConfig;
};