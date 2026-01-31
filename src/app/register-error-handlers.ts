// FILE: src/app/register-error-handlers.js
import { Express } from 'express'
import { errorBoundary, notFoundHandler } from '@/infrastructure/http/middlewares';

export function registerErrorHandlers(app: Express) {
    app.use(notFoundHandler); 
    app.use(errorBoundary);
}