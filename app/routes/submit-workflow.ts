import type { Route } from './+types/submit-workflow'

import { submitWorkflowSchema } from '~/utils/validation'
import { submitWorkflow } from '~/services/db/index.server'

export async function action({ request, context }: Route.ActionArgs) {
  const body = await request.json()
  const apiKey = request.headers.get('x-api-key')

  if (apiKey !== context.cloudflare.env.API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  const result = submitWorkflowSchema.safeParse(body)

  if (!result.success) {
    return new Response('Invalid request', { status: 400 })
  }

  const { data } = result

  await submitWorkflow(data, context.cloudflare.db)

  return new Response('success', { status: 200 })
}
