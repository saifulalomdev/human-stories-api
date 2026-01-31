// packages/db/src/schema/users.ts
import {
    pgTable,
    varchar,
    timestamp,
    index,
    boolean,
    uuid
} from 'drizzle-orm/pg-core'

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date),
}, (table) => { return { nameIndex: index("name_idx").on(table.name) } });