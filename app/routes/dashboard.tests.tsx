import type { Route } from '../+types/root'

import { useLoaderData } from 'react-router'
import { desc } from 'drizzle-orm'
import { PlusIcon, SearchIcon, TestTubeIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { test } from '~/services/db/schema'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// Helper function to get priority badge class
function getPriorityBadge(priority: 'P1' | 'P2' | 'P3') {
  switch (priority) {
    case 'P1':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'P2':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'P3':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

export async function loader({ context }: Route.ActionArgs) {
  const tests = await context.cloudflare.db.query.test.findMany({
    with: {
      team: true
    },
    orderBy: [desc(test.created_at)]
  })

  return { tests }
}

export default function Tests() {
  const { tests } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tests</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Test
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative md:w-1/3">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input className="pl-8" placeholder="Search tests..." />
        </div>

        <select className="h-9 rounded-md border px-3 py-1">
          <option value="">All Priorities</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length > 0 ? (
            tests.map(testItem => (
              <TableRow key={testItem.id}>
                <TableCell className="font-mono text-xs">{testItem.id.substring(0, 8)}...</TableCell>
                <TableCell className="font-medium">
                  <a
                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                    href={`/dashboard/tests/${testItem.id}`}
                  >
                    <TestTubeIcon className="text-muted-foreground mr-2 h-4 w-4" />
                    {testItem.name}
                  </a>
                </TableCell>
                <TableCell>
                  <a
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    href={`/dashboard/teams/${testItem.team_id}`}
                  >
                    {testItem.team.name}
                  </a>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityBadge(testItem.priority)}`}
                  >
                    {testItem.priority}
                  </span>
                </TableCell>
                <TableCell>{formatDate(testItem.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Run
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-muted-foreground py-6 text-center" colSpan={6}>
                No tests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
