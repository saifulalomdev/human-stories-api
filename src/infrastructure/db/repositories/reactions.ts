import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { reactions } from '../schema/reactions';
import { ReactionType } from '../schema/enums';

export async function findReaction(storyId: string, userId: string) {
    const [result] = await db
        .select()
        .from(reactions)
        .where(and(eq(reactions.storyId, storyId), eq(reactions.userId, userId)))
        .limit(1);
    return result;
}

export async function createReaction(storyId: string, userId: string, type: ReactionType) {
    const [result] = await db
        .insert(reactions)
        .values({
            id: crypto.randomUUID(),
            storyId,
            userId,
            type
        })
        .returning();
    return result;
}

export async function deleteReaction(storyId: string, userId: string) {
    const [result] = await db
        .delete(reactions)
        .where(and(eq(reactions.storyId, storyId), eq(reactions.userId, userId)))
        .returning();
    return result;
}

export async function getReactionCount(storyId: string) {
    // Basic count helper
    return await db.select().from(reactions).where(eq(reactions.storyId, storyId));
}