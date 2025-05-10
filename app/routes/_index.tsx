import { redirect } from 'react-router'

export function loader() {
  // TODO: Implement auth in the future
  throw redirect('/dashboard')
}

export default function Home() {
  return <div>Home</div>
}
