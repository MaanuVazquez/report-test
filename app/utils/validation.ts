import { z } from 'zod'
import { createSelectSchema } from 'drizzle-zod'

import { platformEnum, priorityEnum, statusEnum, team, test, workflow, workflowRun } from '~/services/db/schema'

const platformSchema = createSelectSchema(platformEnum)

export type Platform = z.infer<typeof platformSchema>

const statusSchema = createSelectSchema(statusEnum)

export type Status = z.infer<typeof statusSchema>

const prioritySchema = createSelectSchema(priorityEnum)

export type Priority = z.infer<typeof prioritySchema>

export const teamSchema = createSelectSchema(team)

export type Team = z.infer<typeof teamSchema>

export const workflowSchema = createSelectSchema(workflow)

export type Workflow = z.infer<typeof workflowSchema>

export const testSchema = createSelectSchema(test)

export type Test = z.infer<typeof testSchema>

export const workflowRunSchema = createSelectSchema(workflowRun)

export type WorkflowRun = z.infer<typeof workflowRunSchema>

export const submitWorkflowSchema = z.object({
  workflow: z.string(),
  platform: platformSchema,
  branch: z.string().optional().default(''),
  commit: z.string().optional().default(''),
  workflowUrl: z.string().optional().default(''),
  testRunResult: z.array(
    z.object({
      name: z.string(),
      result: statusSchema,
      priority: prioritySchema,
      team: z.string(),
      time: z.number()
    })
  )
})
