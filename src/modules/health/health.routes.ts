import { Router } from "express";
// src/modules/system/system.controller.ts
import { action } from '@/infrastructure/http';

export const healthHandler = action(async () => {
    return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date()
    };
}, "Server is healthy");

export default Router().get("/health", healthHandler)

