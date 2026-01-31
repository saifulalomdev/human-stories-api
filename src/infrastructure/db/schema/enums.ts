import { pgEnum } from 'drizzle-orm/pg-core';

export const reactionTypeEnum = pgEnum("reaction_type", ["like", "love", "insightful", "fire"]);

export type ReactionType = typeof reactionTypeEnum.enumValues[number];