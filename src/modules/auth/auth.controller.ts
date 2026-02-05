// src/modules/auth/auth.controller.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { authService } from "./auth.service.js";
import { loginRoute, registerRoute } from "./auth.routes.js";

const authRoutes = new OpenAPIHono()

authRoutes.openapi(registerRoute, async (c) => {
    const data = c.req.valid("json");
    const res = await authService.registerAccount(data);
    return c.json(res, 201);
});

authRoutes.openapi(loginRoute, async (c) => {
    const data = c.req.valid("json");
    const res = await authService.login(data);
    return c.json(res, 200);
});

export default authRoutes