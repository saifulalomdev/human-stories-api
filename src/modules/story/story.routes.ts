import { Router, IRouter } from 'express';
import { requireAuth } from '@/infrastructure/http/middlewares';
import {
    createNewStory,
    updateStory,
    deleteStory,
    getStoriesFeed,
    getStoryDetails
} from './story.controller';
import {
    idParams,
    storiesCreateSchema,
    storiesUpdateSchema
} from '@repo/db';
import { validateResource } from '@/infrastructure/http/middlewares';

const routes: IRouter = Router();

/**
 * PUBLIC ROUTES
 */

// GET /stories - Fetch paginated feed
routes.get(
    "/",
    getStoriesFeed
);

// GET /stories/:id - Fetch single story details
routes.get(
    "/:id",
    validateResource(idParams, "params"),
    getStoryDetails
);

/**
 * PROTECTED ROUTES
 */

// POST /stories - Create a new story
routes.post(
    "/",
    requireAuth(),
    validateResource(storiesCreateSchema),
    createNewStory
);

// PUT /stories/:id - Update own story
routes.put(
    "/:id",
    requireAuth(),
    validateResource(idParams, "params"),
    validateResource(storiesUpdateSchema),
    updateStory
);

// DELETE /stories/:id - Remove own story
routes.delete(
    "/:id",
    requireAuth(),
    validateResource(idParams, "params"), // Added for safety
    deleteStory
);

export default routes;