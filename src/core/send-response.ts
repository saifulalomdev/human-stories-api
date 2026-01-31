import { Response } from 'express';


export const sendResponse = <T>(
    res: Response,
    statusCode: number = 200,
    message: string,
    success: boolean = true,
    data?: T,
) => {
    return res.status(statusCode).json({
        success,
        message,
        data: data ?? null // Use null instead of undefined for clean JSON
    });
};