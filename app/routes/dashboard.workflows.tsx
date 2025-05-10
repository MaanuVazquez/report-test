import type { Route } from '../+types/root'

import { useLoaderData } from 'react-router'
import { desc } from 'drizzle-orm'
import { ListIcon, PlusIcon, SearchIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { workflow } from '~/services/db/schema'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export async function loader({ context }: Route.LoaderArgs) {
  const workflows = await context.cloudflare.db.select().from(workflow).orderBy(desc(workflow.created_at))

  return { workflows }
}

export default function Workflows() {
  const { workflows } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative md:w-1/3">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input className="pl-8" placeholder="Search workflows..." />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.length > 0 ? (
            workflows.map(workflow => (
              <TableRow key={workflow.id}>
                <TableCell className="font-mono text-xs">{workflow.id.substring(0, 8)}...</TableCell>
                <TableCell className="font-medium">
                  <a
                    className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                    href={`/dashboard/workflows/${workflow.id}`}
                  >
                    <ListIcon className="text-muted-foreground mr-2 h-4 w-4" />
                    {workflow.name}
                  </a>
                </TableCell>
                <TableCell>{formatDate(workflow.created_at)}</TableCell>
                <TableCell>{formatDate(workflow.updated_at)}</TableCell>
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
              <TableCell className="text-muted-foreground py-6 text-center" colSpan={5}>
                No workflows found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
