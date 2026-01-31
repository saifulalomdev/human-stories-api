import { Router, IRouter } from 'express';
import { requireAuth } from '@/infrastructure/http/middlewares';
import { handleToggleReaction } from './reaction.controller';
import { validateResource } from '@/infrastructure/http/middlewares';
import { idParams } from '@repo/db'; // Assuming you have a validator for UUID params

const routes: IRouter = Router();

// POST /reactions/:storyId/toggle
// Body: { "type": "like" }
routes.post(
    "/:storyId/toggle",
    requireAuth(),
    validateResource(idParams, "params"), 
    handleToggleReaction
);

export default routes;