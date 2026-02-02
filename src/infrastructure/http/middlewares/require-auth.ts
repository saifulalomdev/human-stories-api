import { AppError } from "@/core";
import { userRepository } from "@/infrastructure/db";
import * as AuthUtils from "@/modules/auth/auth.utils";
import { Response, NextFunction } from 'express';

type TokenVariant = 'access' | 'reset' | 'refresh';

export function requireToken(variant: TokenVariant = 'access') {
    return async (req: any, _res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new AppError(`You need a valid ${variant} token to continue.`, 401);
            }

            const [scheme, token] = authHeader.split(" ");
            if (scheme !== "Bearer" || !token) {
                throw new AppError("Invalid authorization format", 401);
            }

            // 1. Dynamic Verification based on Variant
            let decoded: any = null;
            if (variant === 'access') decoded = AuthUtils.verifyAccessToken(token);
            if (variant === 'reset')  decoded = AuthUtils.verifyResetToken(token);
            if (variant === 'refresh') decoded = AuthUtils.verifyRefreshToken(token);

            if (!decoded) {
                throw new AppError(`Invalid or expired ${variant} token.`, 401);
            }

            // 2. Fetch User (Normalizing 'id' vs 'userId' from payloads)
            const userId = decoded.id || decoded.userId;
            const user = await userRepository.findById(userId);

            if (!user) {
                throw new AppError("User associated with this token no longer exists.", 404);
            }

            // 3. Attach to request
            req.user = user;
            next();
        } catch (error: any) {
            next(error);
        }
    };
}

// Shortcut for the most common use case
export const requireAuth = () => requireToken('access');
export const requireResetToken = () => requireToken('reset');
