import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

// Create a PostgreSQL connection pool
// This will use the DATABASE_URL environment variable
// For local development, this should point to a local PostgreSQL instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add SSL configuration only for production environments (like Neon)
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// Create a Drizzle instance using the pool and schema
export const db = drizzle(pool, { schema });
