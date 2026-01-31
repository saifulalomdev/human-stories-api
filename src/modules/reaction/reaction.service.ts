import {
    findReaction,
    deleteReaction,
    createReaction,
    ReactionType
} from '@repo/db';

export async function toggleReactionService(storyId: string, userId: string, type:ReactionType) {
    // 1. Check if reaction already exists
    const existing = await findReaction(storyId, userId);

    if (existing) {
        // 2. If same type exists, remove it (Unlike)
        if (existing.type === type) {
            await deleteReaction(storyId, userId);
            return { action: "removed", data: null };
        }

        // 3. If different type, we could update it, or delete and re-create
        await deleteReaction(storyId, userId);
    }

    // 4. Create new reaction
    const newReaction = await createReaction(storyId, userId, type);
    return { action: "created", data: newReaction };
}