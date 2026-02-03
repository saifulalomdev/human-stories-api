// src/common/middleware/notFound.ts
import { AppError } from '@/core';
import { action } from '../action';

export const notFoundHandler = action(async (req) => {
    const message = `${req.method} "${req.originalUrl}" route not found`;
    // By throwing here, the 'action' wrapper catches it 
    // and sends it to your global errorBoundary!
    throw new AppError(message, 404);
});