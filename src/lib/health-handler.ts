import { sendResponse } from '../core/send-response';
import { Request, Response } from 'express';

export async function healthHandler(_req: Request, res: Response) {
    try {
        const data = {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date()
        }
        return sendResponse(res, 200, "Server is healthy", true, data);

    } catch (error) {

        const data = {
            status: 'unhealthy',
            uptime: process.uptime(),
            timestamp: new Date()
        };

        return sendResponse(res, 200, "Server is unhealthy", false, data);
    }
}