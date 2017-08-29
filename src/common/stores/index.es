import ListStore from './ListStore'

const stores = {
  listStore: ListStore,
}

export function createStores (values = {}) {
  const _stores = {}
  for(let name in stores) {
    let Store = stores[name]
    _stores[name] = new Store(values[name])
  }
  return _stores
}
