import { pgTable, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';

export const sessions = pgTable('session', {
    id: uuid('id').primaryKey(), 
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    isRevoked: boolean('is_revoked').default(false).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
});