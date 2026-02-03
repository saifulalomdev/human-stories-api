import { Request, Response, NextFunction } from 'express';

export function action(callback: (req: Request) => Promise<any>, message: string, statusCode: number = 200) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await callback(req);
            res.status(statusCode).json({
                success: true,
                message,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }
}