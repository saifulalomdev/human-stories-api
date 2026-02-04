import { Context } from "hono";
import { AppError } from "./app-error.js";

export function errorBoundary(err: Error, c: Context) {
    // Check if it's our custom error
    if (err instanceof AppError) {
        return c.json({ success: false, error: err.message }, err.statusCode as any);
    }

    // Handle Hono's built-in JWT errors (401s)
    if (err.name === 'JwtTokenInvalid' || err.name === 'JwtTokenExpired') {
        return c.json({ success: false, error: "Unauthorized: Invalid or expired token" }, 401);
    }

    console.error(err);
    return c.json({ success: false, error: "Internal Server Error" }, 500);
}