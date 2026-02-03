// FILE: src/app/register-routes.js
import { Express } from 'express';
import authRoutes from '@/modules/auth';
import docRoutes from '@/modules/doc/doc.routes';
import healthRoutes from '@/modules/health/health.routes';

export function registerRoutes(app: Express) {

    app.use(healthRoutes);
    app.use(authRoutes);
    app.use(docRoutes);
}