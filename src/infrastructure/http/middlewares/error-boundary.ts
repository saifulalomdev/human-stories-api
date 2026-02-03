// src/infrastructure/middleware/error-boundary.ts
import { AppError } from '@/core';
import { logger } from '@/infrastructure/logger';
import { ErrorRequestHandler } from 'express';

export const errorBoundary: ErrorRequestHandler = (err, req, res, _next) => {
    // 1. Log the error
    logger.error({
        msg: err.message,
        path: req.path,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // 2. Determine Status Code
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let data = null;

    // 3. Handle Specific Error Types
    if (err.name === 'ZodError') {
        statusCode = 400;
        message = "Validation Failed";
        data = err.errors;
    } else if (err.code === '23505') {
        statusCode = 409;
        message = "This record already exists";
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
    }

    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
};