export class SafeMap<K,V> extends Map<K,V> {
  get(key: K) {
    const result = super.get(key)
      if (result === undefined) {
          throw Error(`Key ${key} not found in map`)
      } else {
          return result
      }
  }
}