import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '@/core';
import {
    toggleReactionService,
} from './reaction.service';

export async function handleToggleReaction(req: Request<{storyId: string}>, res: Response, next: NextFunction) {
    try {
        const { storyId } = req.params;
        const { type } = req.body; // e.g., "like"
        const userId = req.user.id;

        const result = await toggleReactionService(storyId, userId, type);

        const message = result.action === "created" 
            ? `Story ${type}d successfully` 
            : "Reaction removed";

        return sendResponse(res, 200, message, true, result.data);
    } catch (error) {
        next(error);
    }
}