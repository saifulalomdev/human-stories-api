// src/infrastructure/middleware/error-boundary.ts
import { AppError } from '@/core';
import { logger } from '@/infrastructure/logger';
import { ErrorRequestHandler } from 'express';

export const errorBoundary: ErrorRequestHandler = (err, req, res, _next) => {
    logger.error({
        msg: err.message,
        path: req.path,
    });

    let statusCode = err.statusCode || 500;
    // Don't default to err.message immediately
    let message = "Internal Server Error";
    let data = null;

    if (err.name === 'ZodError') {
        statusCode = 400;
        message = "Validation Failed";
        data = err.errors;
    } else if (err.code === '23505') {
        statusCode = 409;
        message = "This record already exists";
    } else if (err instanceof AppError || err.name === 'AppError') {
        // Only if it's a deliberate AppError do we trust the message
        statusCode = err.statusCode;
        message = err.message;
    }
    // If it's a generic Error("Something exploded!"), 
    // it skips all blocks and stays "Internal Server Error"

    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
};