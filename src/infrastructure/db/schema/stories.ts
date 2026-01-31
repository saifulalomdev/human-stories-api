import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { reactions } from "./reactions";

// 2. Stories Table
export const stories = pgTable("stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // Added onDelete: "cascade" here
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const storiesRelations = relations(stories, ({ one, many }) => ({
  author: one(users, {
    fields: [stories.authorId],
    references: [users.id]
  }),
  reactions: many(reactions),
}));