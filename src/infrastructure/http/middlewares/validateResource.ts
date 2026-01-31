import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateResource = (
    schema: ZodObject<any>, 
    key: "body" | "params" | "query" = "body"
) => (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req[key]);

    if (!result.success) {
        const issue = result.error.issues[0];
        const pathName = String(issue?.path?.[0] ?? "field");
        const message = issue?.message ?? "Invalid value";

        return res.status(400).json({
            success: false,
            message: "Validation Error",
            error: {
                message: `${pathName}: ${message}`,
                details: result.error.flatten()
            }
        });
    }

    // Replace original data with the Zod-parsed (and cleaned) data
    req[key] = result.data;
    next();
};