import { pgTable, uuid, unique } from "drizzle-orm/pg-core";
import { stories } from "./stories";
import { users } from "./users";
import { reactionTypeEnum } from "./enums";
import { relations } from "drizzle-orm";

// 3. Reactions Table (The Connection)
export const reactions = pgTable("reactions", {
    id: uuid("id").primaryKey(),
    storyId: uuid("story_id").references(() => stories.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    type: reactionTypeEnum("type").default("like").notNull(),
}, (t) => ({ unq: unique().on(t.storyId, t.userId) }));


export const reactionsRelations = relations(reactions, ({ one }) => ({
  story: one(stories, { fields: [reactions.storyId], references: [stories.id] }),
  user: one(users, { fields: [reactions.userId], references: [users.id] }),
}));