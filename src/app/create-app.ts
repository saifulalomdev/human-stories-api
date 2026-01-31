// FILE: src/app/create-app.js

import express, { type Express } from 'express';
import { registerMiddlewares } from './register-middlewares';
import { registerRoutes } from './register-routes';
import { registerErrorHandlers } from './register-error-handlers';

export async function createApp(): Promise<Express> {
    const app = express();

    registerMiddlewares(app);
    registerRoutes(app);
    registerErrorHandlers(app);

    return app;
};