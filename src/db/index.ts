import { env } from '@/config/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schemas/index.js';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: env.DATABASE_URL
});

export const db = drizzle(pool, { schema });