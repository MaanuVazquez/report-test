import { createColumnHelper } from '@tanstack/react-table'

import { Button } from '~/components/ui/button'
import { formatDate, formatDuration } from '~/utils/date'
import type { Platform, Status, WorkflowRun } from '~/utils/validation'

// Create column definitions using the column helper
const columnHelper = createColumnHelper<WorkflowRun>()

function getStatusBadge(status: Status) {
  return status === 'SUCCESS'
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

function getPlatformBadge(platform: Platform) {
  return platform === 'IOS'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
}

export const columns = [
  columnHelper.accessor('workflow_id', {
    header: 'Workflow',
    cell: info => {
      const workflowId = info.getValue()

      const workflows = (info.table.options.meta as unknown as { workflows: { id: string; name: string }[] })?.workflows
      const workflow = workflows?.find(w => w.id === workflowId)

      return workflow ? (
        <a className="text-blue-600 hover:underline dark:text-blue-400" href={`/dashboard/workflows/${workflowId}`}>
          {workflow.name}
        </a>
      ) : (
        workflowId
      )
    },
    filterFn: (row, _, filterValue) => {
      return filterValue === row.original.workflow_id
    }
  }),
  columnHelper.accessor('branch', {
    header: 'Branch',
    cell: info => <code>{info.getValue()}</code>
  }),
  columnHelper.accessor('created_at', {
    header: 'Date',
    cell: info => formatDate(info.getValue())
  }),
  columnHelper.accessor('platform', {
    header: 'Platform',
    cell: info => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPlatformBadge(info.getValue())}`}
      >
        {info.getValue()}
      </span>
    ),
    filterFn: 'equalsString' // Enable exact match filtering for this column
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(info.getValue())}`}
      >
        {info.getValue()}
      </span>
    ),
    filterFn: 'equalsString' // Enable exact match filtering for this column
  }),
  columnHelper.accessor('time', {
    header: 'Time',
    cell: info => {
      const totalSeconds = info.getValue()

      return formatDuration(totalSeconds)
    }
  }),
  columnHelper.accessor('workflow_url', {
    header: 'Actions',
    cell: info =>
      info.getValue() ? (
        <Button asChild size="sm" variant="outline">
          <a href={info.getValue()!} rel="noopener noreferrer" target="_blank">
            View
          </a>
        </Button>
      ) : null
  })
]
