// src/modules/doc/doc.routes.ts
import { Router } from "express";
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiSpec } from "./doc.service";

const router = Router();

const spec = generateOpenApiSpec();

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(spec));

export default router;