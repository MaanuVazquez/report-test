import type { DrizzleClient } from './client.server'
import type { z } from 'zod'

import { eq } from 'drizzle-orm'

import { tryCatch } from '~/utils/try-catch'
import type { Priority, Status, submitWorkflowSchema, Team, Test, Workflow } from '~/utils/validation'
import { teamCacheKey, testCacheKey, workflowCacheKey } from '~/utils/cache'

import { cacheInstance } from '../cache.server'

import {
  team as teamTable,
  test as testTable,
  testRun as testRunTable,
  workflow as workflowTable,
  workflowRun as workflowRunTable
} from './schema'

export async function submitWorkflow(data: z.infer<typeof submitWorkflowSchema>, db: DrizzleClient) {
  let workflowTime = 0
  let workflowStatus: Status = 'SUCCESS'
  const workflowTests = []

  for (const testResult of data.testRunResult) {
    workflowTime += testResult.time

    if (testResult.result === 'ERROR') {
      workflowStatus = 'ERROR'
    }

    const team = await getOrCreateTeam(testResult.team, db)
    const test = await getOrCreateTest(db, testResult.name, testResult.priority, team.id)

    workflowTests.push({
      id: test.id,
      name: test.name,
      priority: test.priority,
      team_id: team.id,
      time: testResult.time,
      result: testResult.result
    })
  }

  const workflow = await getOrCreateWorkflow(db, data.workflow)

  const workflowRun = await db
    .insert(workflowRunTable)
    .values({
      workflow_id: workflow.id,
      status: workflowStatus,
      time: workflowTime,
      platform: data.platform,
      branch: data.branch,
      commit: data.commit,
      workflow_url: data.workflowUrl
    })
    .returning()

  return db.insert(testRunTable).values(
    workflowTests.map(workflowTests => ({
      test_id: workflowTests.id,
      workflow_run_id: workflowRun[0].id,
      platform: data.platform,
      status: workflowTests.result,
      time: workflowTests.time
    }))
  )
}

async function getOrCreateTeam(name: string, db: DrizzleClient) {
  if (cacheInstance.has(teamCacheKey(name))) {
    console.log('Team from cache', name)

    return cacheInstance.get<Team>(teamCacheKey(name))
  }

  const result = await tryCatch(db.query.team.findFirst({ where: eq(teamTable.name, name) }))

  if (result.error) {
    console.error('Error fetching team', result.error)
  }

  let team = result.data

  if (team) {
    console.log('Team from db', team.name)
  }

  if (!team) {
    team = (await db.insert(teamTable).values({ name }).returning())[0]

    console.log('Created team', team.name)
  }

  cacheInstance.set(teamCacheKey(name), team)

  return team
}

async function getOrCreateTest(db: DrizzleClient, name: string, priority: Priority, team_id: string) {
  if (cacheInstance.has(testCacheKey(name))) {
    console.log('Test from cache', name)

    return cacheInstance.get<Test>(testCacheKey(name))
  }

  const result = await tryCatch(db.query.test.findFirst({ where: eq(testTable.name, name) }))

  if (result.error) {
    console.error('Error fetching test', result.error)
  }

  let test = result.data

  if (test) {
    console.log('Test from db', test.name)
  }

  if (!test) {
    test = (await db.insert(testTable).values({ name, priority, team_id }).returning())[0]

    console.log('Created test', test.name)
  }

  cacheInstance.set(testCacheKey(name), test)

  return test
}

async function getOrCreateWorkflow(db: DrizzleClient, name: string) {
  if (cacheInstance.has(workflowCacheKey(name))) {
    return cacheInstance.get<Workflow>(workflowCacheKey(name))
  }

  const { data, error } = await tryCatch(db.select().from(workflowTable).where(eq(workflowTable.name, name)))

  if (error) {
    console.error('Error fetching workflow', error)
  }

  const workflow = data?.length ? data[0] : (await db.insert(workflowTable).values({ name }).returning())[0]

  cacheInstance.set(workflowCacheKey(name), workflow)

  return workflow
}

export async function getTeams(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(teamTable))

  if (error) {
    console.error('Error fetching teams', error)

    return []
  }

  return data
}

export async function getWorkflows(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(workflowTable))

  if (error) {
    console.error('Error fetching workflows', error)

    return []
  }

  return data
}

export async function getTests(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(testTable))

  if (error) {
    console.error('Error fetching tests', error)

    return []
  }

  return data
}

export async function getWorkfowRuns(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(workflowRunTable))

  if (error) {
    console.error('Error fetching workflow runs', error)

    return []
  }

  return data
}

export async function getTestRuns(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(testRunTable))

  if (error) {
    console.error('Error fetching test runs', error)

    return []
  }

  return data
}
