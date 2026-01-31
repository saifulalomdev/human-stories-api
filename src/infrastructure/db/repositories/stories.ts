import { and, eq, desc, count } from 'drizzle-orm';
import { db } from '../db';
import { stories } from '../schema/stories';
import { StoriesInsert, StoriesUpdate } from '../validators/stories';

/**
 * CREATE: Saves a new story and returns the created record
 */
export async function createStory(input: StoriesInsert) {
    const [story] = await db.insert(stories).values(input).returning();
    return story;
}

/**
 * UPDATE: Updates a story only if the author matches
 */
export async function updateStory(
    storyId: string,
    authorId: string,
    input: StoriesUpdate
) {
    const [updatedStory] = await db
        .update(stories)
        .set(input)
        .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
        .returning();

    return updatedStory;
}

/**
 * DELETE: Removes a story only if the author matches
 */
export async function deleteStory(
    storyId: string,
    authorId: string,
) {
    const [deletedStory] = await db
        .delete(stories)
        .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
        .returning();

    return deletedStory;
}

/**
 * FIND ONE: Basic retrieval by ID
 */
export async function findStoryById(storyId: string) {
    const [story] = await db
        .select()
        .from(stories)
        .where(eq(stories.id, storyId))
        .limit(1);
    return story || null;
}

/**
 * DETAILS: Retrieval with specific author check (for editing/viewing)
 */
export async function getStoryDetails(storyId: string, authorId: string) {
    const [story] = await db
        .select()
        .from(stories)
        .where(and(eq(stories.id, storyId), eq(stories.authorId, authorId)))
        .limit(1);
    return story || null;
}

/**
 * PAGINATION: Returns a slice of stories and the total count
 */
export async function findStoriesPaginated(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;

    // Run both queries to get data and total count for the frontend
    const [data, totalResult] = await Promise.all([
        db.select()
            .from(stories)
            .orderBy(desc(stories.createdAt))
            .limit(pageSize)
            .offset(offset),
        db.select({ value: count() }).from(stories)
    ]);

    const total = totalResult[0].value;
    const totalPages = Math.ceil(total / pageSize);

    return {
        data,
        meta: {
            total,
            page,
            pageSize,
            totalPages
        }
    };
}