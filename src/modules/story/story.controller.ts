import { sendResponse } from '@/core'
import { NextFunction, Request, Response } from 'express'
import * as StoryService from './story.service'
import { StoriesInsert, StoriesUpdate } from '@repo/db';

/**
 * POST /stories
 */
export async function createNewStory(req: Request, res: Response, next: NextFunction) {
    try {
        // We inject the user ID from the auth middleware
        const input: StoriesInsert = { ...req.body, authorId: req.user.id };
        const story = await StoryService.createStoryService(input);
        
        return sendResponse(res, 201, "Story saved successfully!", true, story);
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /stories/:id
 */
export async function updateStory(req: Request<{id: string}>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const input: StoriesUpdate = req.body;
        
        const story = await StoryService.updateStoryService(id, req.user.id, input);
        
        return sendResponse(res, 200, "Story updated successfully!", true, story);
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /stories/:id
 */
export async function deleteStory(req: Request<{id: string}>,res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await StoryService.deleteStoryService(id, req.user.id);
        
        return sendResponse(res, 200, "Story deleted successfully!", true);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /stories/:id
 */
export async function getStoryDetails(req: Request<{id: string}>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const story = await StoryService.getStoryByIdService(id);
        
        return sendResponse(res, 200, "Story fetched successfully!", true, story);
    } catch (error) {
        next(error);
    }
}

/**
 * GET /stories?page=1&limit=10
 */
export async function getStoriesFeed(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const stories = await StoryService.getStoriesFeedService(page, limit);
        
        return sendResponse(res, 200, "Feed fetched successfully!", true, stories);
    } catch (error) {
        next(error);
    }
}