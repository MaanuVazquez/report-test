import { redirect, useMatches } from 'react-router'

export function loader() {
  // TODO: Implement auth in the future
  throw redirect('/dashboard')
}

export default function Home() {
  const routes = useMatches()

  return <div>{JSON.stringify(routes[0].data)}</div>
}
