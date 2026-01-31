// src/common/middleware/notFound.js
import { sendResponse } from '@/core/send-response';
import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {

    const message = `${req.method.toString()} "${req.originalUrl}" route  not found`;

    return sendResponse(res, 404, message, false, null);
}