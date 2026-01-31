import { stories } from '../schema/stories';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const storiesBaseSchema = createInsertSchema(stories);

export const storiesInsertSchema = storiesBaseSchema.pick({
    title: true,
    content: true,
    authorId: true
});

export const storiesCreateSchema = storiesInsertSchema.omit({ authorId: true })

export const storiesUpdateSchema = storiesCreateSchema.partial()

export type Stories = z.infer<typeof storiesBaseSchema>
export type StoriesInsert = z.infer<typeof storiesInsertSchema>
export type StoriesCreate = z.infer<typeof storiesCreateSchema>
export type StoriesUpdate = z.infer<typeof storiesUpdateSchema>