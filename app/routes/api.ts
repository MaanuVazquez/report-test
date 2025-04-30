import type { Route } from './+types/api'

import { submitWorkflow } from '~/services/db/index.server'

export async function action({ request, context }: Route.ActionArgs) {
  const body = await request.json()
  const apiKey = request.headers.get('x-api-key')

  if (apiKey !== context.cloudflare.env.API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  console.log(body, submitWorkflow())

  return new Response('success', { status: 200 })
}
