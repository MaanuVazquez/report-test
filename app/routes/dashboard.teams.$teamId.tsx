import type { Route } from './+types/dashboard.teams.$teamId'

import { useLoaderData } from 'react-router'
import { eq, sql } from 'drizzle-orm'

import { team, test, testRun } from '~/services/db/schema'
import TeamTestsTable from '~/components/tables/TeamTestsTable'

export async function loader({ params, context }: Route.LoaderArgs) {
  const { teamId } = params
  const teamTests = await context.cloudflare.db
    .select({
      id: test.id,
      name: test.name,
      priority: test.priority,
      created_at: test.created_at,
      teamId: test.team_id,
      teamName: team.name,
      successRate: sql`COALESCE(AVG(CASE WHEN test_run.status = 'SUCCESS' THEN 100 ELSE 0 END), 0)`.mapWith(Number)
    })
    .from(test)
    .where(eq(test.team_id, teamId || ''))
    .leftJoin(team, eq(test.team_id, team.id))
    .leftJoin(testRun, eq(test.id, testRun.test_id))
    .groupBy(test.id, team.name)

  return { teamTests }
}

export type DashboardTeamTestsLoaderData = Awaited<ReturnType<typeof loader>>

export default function Team() {
  const { teamTests } = useLoaderData<typeof loader>()
  const firstTest = teamTests[0]

  if (!teamTests.length) {
    return <div className="p-4">Team not found.</div>
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold">{firstTest.teamName}</h1>
      <TeamTestsTable teamTests={teamTests} />
    </div>
  )
}
