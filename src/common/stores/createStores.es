import ListStore from './ListStore'

const stores = {
  listStore: ListStore,
}

export default function (values = {}) {
  const _stores = {}
  for(let name in stores) {
    let Store = stores[name]
    _stores[name] = new Store(values[name])
  }
  return _stores
}
