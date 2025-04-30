import type { DrizzleClient } from './client.server'

import { tryCatch } from '~/utils/try-catch'

import { team, test, workflow } from './schema.server'

export async function submitWorkflow() {}

export async function getTeams(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(team))

  if (error) {
    console.error('Error fetching teams', error)

    return []
  }

  return data
}

export async function getWorkflows(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(workflow))

  if (error) {
    console.error('Error fetching workflows', error)

    return []
  }

  return data
}

export async function getTests(db: DrizzleClient) {
  const { data, error } = await tryCatch(db.select().from(test))

  if (error) {
    console.error('Error fetching tests', error)

    return []
  }

  return data
}
