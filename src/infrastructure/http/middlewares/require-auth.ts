import { AppError } from "@/core";
import { verifyAccessToken } from "@/modules/auth/auth.utils";
import { Response, NextFunction } from 'express';

export function requireAuth() {
    return (req: any, _res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw new AppError("You need to be signed in to continue.", 401);
            }

            const [scheme, token] = authHeader.split(" ");

            if (scheme !== "Bearer" || !token) {
                throw new AppError("Invalid authorization format", 401);
            }

            const decodedData = verifyAccessToken(token);

            // --- The Critical Null Check ---
            if (!decodedData) {
                throw new AppError("Session expired or invalid. Please sign in again.", 401);
            }

            req.user = decodedData;

            next()
        } catch (error: any) {
            if (error.name === "JsonWebTokenError") {
                throw new AppError("Invalid token. Please sign in again.", 401);
            }
            if (error.name === "JsonWebTokenError") {
                throw new AppError("Invalid token. Please sign in again.", 401);
            }
            next(error)
        }
    }
}