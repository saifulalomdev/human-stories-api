// @saifulalom.com/core -> src/http/validator.ts
import { ZodSchema } from 'zod';

type RequestPart = "body" | "params" | "query";

/**
 * Validates a request part against a Zod schema.
 * If validation fails, it hands the error to the global error boundary.
 */
export const validateRequest = (schema: ZodSchema, part: RequestPart = "body") =>
    (req: any, _res: any, next: any) => {

        const result = schema.safeParse(req[part]);

        if (!result.success) {
            return next(result.error);
        }

        // Clean data is assigned back to the request
        req[part] = result.data;
        next();
    };