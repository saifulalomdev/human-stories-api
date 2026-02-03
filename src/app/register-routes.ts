// FILE: src/app/register-routes.js
import { Express } from 'express';
import { healthHandler } from '../lib/health-handler';
import authRoutes from '@/modules/auth';
import swaggerUI from 'swagger-ui-express'
import { generateOpenApiSpec } from '@/infrastructure/open-api/generate-openapi';
// import storyRoutes from '@/modules/story';
// import reactionRoutes from '@/modules/reaction';

export function registerRoutes(app: Express) {

    app.get("/health", healthHandler);
    app.use("/auth", authRoutes);
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(generateOpenApiSpec()));

    // app.use("/stories", storyRoutes);
    // app.use("/reactions", reactionRoutes);
}