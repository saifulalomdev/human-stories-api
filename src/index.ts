import { OpenAPIHono } from '@hono/zod-openapi'
import { openApiConfig } from './config/openapi.js'
import { swaggerUI } from '@hono/swagger-ui';
import authRoutes from './modules/auth/auth.controller.js'
import { errorBoundary } from './lib/error-boundary.js';

const app = new OpenAPIHono()

app.route("/auth", authRoutes);

app.doc("/doc", openApiConfig);

app.get("/ui", swaggerUI({ url: "/doc" }));

app.onError(errorBoundary)

export default app
