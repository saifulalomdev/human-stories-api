import { AppError, sendResponse } from '@/core';
import { logger } from '@/infrastructure/logger';
import { ErrorRequestHandler } from 'express'

export const errorBoundary: ErrorRequestHandler = (err, req, res, _next) => {
    logger.error({
        msg: err.message,
        path: req.path,
    });

    const statusCode = err.statusCode || (err instanceof AppError ? err.statusCode : 500);

    if (statusCode !== 500 || err instanceof AppError || err.name === 'AppError') {
        return sendResponse(res, statusCode, err.message, false, null);
    }

    if (err.name === 'ZodError') {
        return sendResponse(res, 400, "Validation Failed", false, err.errors);
    }

    if (err.code === '23505') {
        return sendResponse(res, 409, "This record already exists", false, null);
    }

    // Match your test expectation or update the test
    return sendResponse(res, 500, "Internal Server Error", false, null);
};