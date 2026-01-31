// FILE: src/app/register-middlewares.js
import express, { type Express } from 'express';
import cors from 'cors';

export function registerMiddlewares(app: Express) {

    app.use(express.json());
    app.disable("x-powered-by");
    app.use(cors({ origin: "*" }));
}