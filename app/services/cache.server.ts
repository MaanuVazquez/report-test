function createCache() {
  const cache = {
    data: new Map(),
    set: <T>(key: string, value: T) => {
      cache.data.set(key, value)
    },
    get: <T>(key: string): T => cache.data.get(key),
    has: (key: string) => cache.data.has(key),
    delete: (key: string) => {
      return cache.data.delete(key)
    },
    clear: () => {
      cache.data.clear()
    }
  }

  return cache
}

const cacheInstance = createCache()

export { cacheInstance }
