import { Router } from "express";
import { action } from '@/infrastructure/http';

// health controller
export const healthHandler = action(async () => {
    return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date()
    };
}, "Server is healthy");

export default Router().get("/health", healthHandler)

