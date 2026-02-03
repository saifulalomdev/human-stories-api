// FILE: src/app/create-app.js
import '../core/zod-setup';
import express, { type Express } from 'express';
import { registerMiddlewares } from './register-middlewares';
import { registerRoutes } from './register-routes';
import { registerErrorHandlers } from './register-error-handlers';

export function createApp(): Express{
    const app = express();

    registerMiddlewares(app);
    registerRoutes(app);
    registerErrorHandlers(app);

    return app;
};