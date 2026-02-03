// src/modules/doc/doc.routes.ts
import { Router } from "express";
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiSpec } from "./doc.service";

const router = Router();

<<<<<<< HEAD
const spec = generateOpenApiSpec();

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(spec));
=======
// We generate the spec ONCE or inside a middleware
router.use("/docs", swaggerUi.serve);
router.get("/docs", (req, res, next) => {
    const spec = generateOpenApiSpec();
    swaggerUi.setup(spec)(req, res, next);
});
>>>>>>> 6df6c70 (feat(routes): implement health and documentation routes, refactor route registration)

export default router;