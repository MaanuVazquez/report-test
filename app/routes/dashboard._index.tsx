import type { Route } from './+types/dashboard._index'
import type { loader as dashboardIndexLoader } from './dashboard._index'

import { useLoaderData } from 'react-router'
import { desc } from 'drizzle-orm'

import { workflowRun } from '~/services/db/schema'
import DashboardTable from '~/components/tables/DashboardTable'
import useRootData from '~/hooks/use-root-data'

// Loader function to fetch workflow runs
export async function loader({ context }: Route.LoaderArgs) {
  const workflowRuns = await context.cloudflare.db.query.workflowRun.findMany({
    orderBy: [desc(workflowRun.created_at)],
    limit: 50
  })

  return { workflowRuns }
}

export default function DashboardIndex() {
  const { workflowRuns } = useLoaderData<typeof dashboardIndexLoader>()
  const { workflows } = useRootData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recent Workflow Runs</h1>
      </div>

      <DashboardTable workflowRuns={workflowRuns} workflows={workflows} />
    </div>
  )
}
