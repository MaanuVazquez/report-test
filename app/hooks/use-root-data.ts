import { useMatches } from 'react-router'

import type { Team, Workflow } from '~/utils/validation'

export default function useRootData() {
  const matches = useMatches()

  return matches[0].data as unknown as {
    teams: Team[]
    workflows: Workflow[]
  }
}
