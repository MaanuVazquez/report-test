import { pgTable, uuid, varchar, timestamp, integer, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// Enums
export const platformEnum = pgEnum('platform', ['IOS', 'ANDROID'])

export const statusEnum = pgEnum('status', ['SUCCESS', 'ERROR'])

export const priorityEnum = pgEnum('priority', ['P1', 'P2', 'P3'])

// Tables
export const workflow = pgTable(
  'workflow',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    name: varchar('name').notNull().unique(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date())
  },
  t => [uniqueIndex('workflow_name_idx').on(t.name)]
)

export const workflowRun = pgTable('workflow_run', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  workflow_id: uuid('workflow_id')
    .references(() => workflow.id)
    .notNull(),
  platform: platformEnum('platform').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
  status: statusEnum('status').notNull(),
  time: integer('time').notNull(),
  branch: varchar('branch'),
  commit: varchar('commit'),
  workflow_url: varchar('workflow_url')
})

export const team = pgTable(
  'team',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    name: varchar('name').notNull().unique(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date())
  },
  t => [uniqueIndex('team_name_idx').on(t.name)]
)

export const test = pgTable(
  'test',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    name: varchar('name').notNull().unique(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
    team_id: uuid('team_id')
      .references(() => team.id)
      .notNull(),
    priority: priorityEnum('priority').notNull()
  },
  t => [uniqueIndex('test_name_idx').on(t.name)]
)

export const testRun = pgTable('test_run', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  test_id: uuid('test_id')
    .references(() => test.id)
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
  workflow_run_id: uuid('workflow_run_id')
    .references(() => workflowRun.id)
    .notNull(),
  time: integer('time').notNull(),
  status: statusEnum('status').notNull(),
  platform: platformEnum('platform').notNull()
})

// Relations
export const workflowRelations = relations(workflow, ({ many }) => ({
  workflowRuns: many(workflowRun)
}))

export const workflowRunRelations = relations(workflowRun, ({ one, many }) => ({
  workflow: one(workflow, {
    fields: [workflowRun.workflow_id],
    references: [workflow.id]
  }),
  testRuns: many(testRun)
}))

export const teamRelations = relations(team, ({ many }) => ({
  tests: many(test)
}))

export const testRelations = relations(test, ({ one, many }) => ({
  team: one(team, {
    fields: [test.team_id],
    references: [team.id]
  }),
  testRuns: many(testRun)
}))

export const testRunRelations = relations(testRun, ({ one }) => ({
  test: one(test, {
    fields: [testRun.test_id],
    references: [test.id]
  }),
  workflowRun: one(workflowRun, {
    fields: [testRun.workflow_run_id],
    references: [workflowRun.id]
  })
}))
