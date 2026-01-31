import { 
    createStory, 
    updateStory, 
    deleteStory, 
    findStoryById, 
    findStoriesPaginated, 
    StoriesInsert,
    StoriesUpdate
} from "@repo/db";

/**
 * Logic: Create a new story
 */
export async function createStoryService(input: StoriesInsert) {
    // Add business logic here (e.g., checking user's monthly post limit)
    const story = await createStory(input);
    if (!story) throw new Error("Failed to create story");
    return story;
}

/**
 * Logic: Update an existing story with ownership check
 */
export async function updateStoryService(storyId: string, authorId: string, input: StoriesUpdate) {
    const updatedStory = await updateStory(storyId, authorId, input);
    
    if (!updatedStory) {
        throw new Error("Story not found or you are not authorized to edit it");
    }
    
    return updatedStory;
}

/**
 * Logic: Delete a story with ownership check
 */
export async function deleteStoryService(storyId: string, authorId: string) {
    const deletedStory = await deleteStory(storyId, authorId);
    
    if (!deletedStory) {
        throw new Error("Story not found or you are not authorized to delete it");
    }
    
    return deletedStory;
}

/**
 * Logic: Get a single story by ID (Public View)
 */
export async function getStoryByIdService(storyId: string) {
    const story = await findStoryById(storyId);
    
    if (!story) {
        throw new Error("Story not found");
    }
    
    return story;
}

/**
 * Logic: Get Feed/List with Pagination
 */
export async function getStoriesFeedService(page: number, pageSize: number) {
    // Business logic: perhaps filter out stories that are "drafts" for the public feed
    return await findStoriesPaginated(page, pageSize);
}