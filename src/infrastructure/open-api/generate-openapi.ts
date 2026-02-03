// src/common/docs/generate-openapi.js
import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();


registry.registerComponent("securitySchemes" , "bearerAuth" , {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
});

export function generateOpenApiSpec() {
    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "Human stories",
            version: "1.0.0",
            description: "Human stories REST API documentation",
        },
        servers: [
            { url: "http://localhost:5000"  , description: "Development server"},
            { url: "https://buyflow-0gs4.onrender.com" , description: "Production server" },
        ],
    });
}