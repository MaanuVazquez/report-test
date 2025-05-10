export function teamCacheKey(name: string) {
  return `team:${name}`
}

export function workflowCacheKey(id: string) {
  return `workflow:${id}`
}

export function testCacheKey(id: string) {
  return `test:${id}`
}
