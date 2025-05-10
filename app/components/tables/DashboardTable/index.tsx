import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

import { capitalize } from '~/utils/string'
import type { WorkflowRun, Workflow } from '~/utils/validation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

import { columns } from './table-configuration'

type Props = {
  workflowRuns: WorkflowRun[]
  workflows: Workflow[]
}

export default function DashboardTable({ workflowRuns, workflows }: Props) {
  // State for TanStack Table filters
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // State for sorting
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true } // Default sort by date descending
  ])

  // Create the table instance
  const table = useReactTable({
    data: workflowRuns,
    columns,
    state: {
      columnFilters,
      sorting
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      workflows
    }
  })

  const handleWorkflowChange = (value: string) => {
    table.getColumn('workflow_id')?.setFilterValue(value === 'all' ? undefined : value) // Set to undefined to clear filter
  }

  const handlePlatformChange = (value: string) => {
    table.getColumn('platform')?.setFilterValue(value === 'all' ? undefined : value) // Set to undefined to clear filter
  }

  const handleStatusChange = (value: string) => {
    // Directly use the value provided by Shadcn Select's onValueChange
    table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)
  }

  const workflowSelect = useMemo(() => {
    return workflows.map(w => (
      <SelectItem key={w.id} value={w.id}>
        {capitalize(w.name)}
      </SelectItem>
    ))
  }, [workflows])

  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Select
          value={(table.getColumn('workflow_id')?.getFilterValue() as string) ?? 'all'}
          onValueChange={handleWorkflowChange}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Filter by Workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All workflows</SelectItem>
            {workflowSelect}
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn('platform')?.getFilterValue() as string) ?? 'all'}
          onValueChange={handlePlatformChange}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Filter by Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="IOS">iOS</SelectItem>
            <SelectItem value="ANDROID">Android</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={handleStatusChange} // Reuse or inline the handler
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="ERROR">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? 'flex cursor-pointer items-center select-none' : ''}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
                        desc: <ArrowDownIcon className="ml-2 h-4 w-4" />
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-muted-foreground py-6 text-center" colSpan={columns.length}>
                No workflow runs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
