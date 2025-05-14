import { createColumnHelper } from '@tanstack/react-table'
import { FlaskConical, User } from 'lucide-react'

import { Button } from '~/components/ui/button'
import type { DashboardTeamTestsLoaderData } from '~/routes/dashboard.teams.$teamId'
import type { DashboardTeamsLoaderData } from '~/routes/dashboard.teams._index'
import { formatDate, formatDuration } from '~/utils/date'

// Create column definitions using the column helper
const columnHelper = createColumnHelper<DashboardTeamTestsLoaderData['teamTests'][number]>()

export const columns = [
  columnHelper.accessor('id', {
    header: 'Test name',
    cell: info => {
      const testId = info.getValue()

      return (
        <a className="flex text-blue-600 hover:underline dark:text-blue-400" href={`/dashboard/test/${testId}`}>
          <FlaskConical /> {info.row.original.name}
        </a>
      )
    }
  }),
  columnHelper.accessor('successRate', {
    header: 'Success rate',
    cell: info => `${info.getValue()}%`
  }),
  columnHelper.accessor('created_at', {
    header: 'Added on',
    cell: info => formatDate(info.getValue())
  })
]
