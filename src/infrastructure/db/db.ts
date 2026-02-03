// packages/db/src/db.ts
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema/user';
import { env } from '@/config/env';

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });