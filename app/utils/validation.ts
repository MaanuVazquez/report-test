import { z } from 'zod'
import { createSelectSchema } from 'drizzle-zod'

import { platformEnum, priorityEnum, statusEnum } from '~/services/db/schema.server'

export function submitWorkflowSchema() {
  return z.object({
    workflowName: z.string(),
    platform: createSelectSchema(platformEnum),
    testRunResult: z.array(
      z.object({
        name: z.string(),
        result: createSelectSchema(statusEnum).optional(),
        priority: createSelectSchema(priorityEnum),
        team: z.string()
      })
    )
  })
}
