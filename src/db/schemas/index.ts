import {
    pgTable,
    text,
    timestamp,
    uuid
} from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});
