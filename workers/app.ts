import { createRequestHandler } from 'react-router'

import { getDrizzleClient, type DrizzleClient } from '../app/services/db/client.server'

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
      db: DrizzleClient
    }
  }
}

const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)

export default {
  async fetch(request, env, ctx) {
    const db = getDrizzleClient(env.DATABASE_URL)

    return requestHandler(request, {
      cloudflare: { env, ctx, db }
    })
  }
} satisfies ExportedHandler<Env>
