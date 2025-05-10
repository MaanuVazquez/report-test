import { createColumnHelper } from '@tanstack/react-table'
import { User } from 'lucide-react'

import { Button } from '~/components/ui/button'
import type { DashboardTeamsLoaderData } from '~/routes/dashboard.teams._index'
import { formatDate, formatDuration } from '~/utils/date'

// Create column definitions using the column helper
const columnHelper = createColumnHelper<DashboardTeamsLoaderData['teams'][number]>()

export const columns = [
  columnHelper.accessor('id', {
    header: 'Team',
    cell: info => {
      const teamId = info.getValue()

      return (
        <a className="flex text-blue-600 hover:underline dark:text-blue-400" href={`/dashboard/teams/${teamId}`}>
          <User /> {info.row.original.name}
        </a>
      )
    }
  }),
  columnHelper.accessor('testCount', {
    header: 'Test count',
    cell: info => <code>{info.getValue()}</code>
  }),
  columnHelper.accessor('created_at', {
    header: 'Created',
    cell: info => formatDate(info.getValue())
  })
]
