import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

export type DrizzleClient = ReturnType<typeof getDrizzleClient>

export function getDrizzleClient(DATABASE_URL: string) {
  const sql = neon(DATABASE_URL)

  return drizzle({ client: sql, schema })
}
