import type { Route } from '../+types/root'

import { useLoaderData } from 'react-router'
import { count, eq, desc } from 'drizzle-orm'

import TeamsTable from '~/components/tables/TeamsTable'
import { team, test } from '~/services/db/schema'

export async function loader({ context }: Route.ActionArgs) {
  const teams = await context.cloudflare.db
    .select({
      id: team.id,
      name: team.name,
      testCount: count(test.id),
      created_at: team.created_at,
      updated_at: team.updated_at
    })
    .from(team)
    .leftJoin(test, eq(team.id, test.team_id))
    .groupBy(team.id)
    .orderBy(desc(team.name))

  return { teams }
}

export type DashboardTeamsLoaderData = Awaited<ReturnType<typeof loader>>

export default function Teams() {
  const { teams } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
      </div>
      <TeamsTable teams={teams} />
    </div>
  )
}
