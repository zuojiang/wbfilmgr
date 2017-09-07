import FileStore from './FileStore'
import ConfigStore from './ConfigStore'

const stores = {
  configStore: ConfigStore,
  fileStore: FileStore,
}

export default function (values = {}) {
  const _stores = {}
  for(let name in stores) {
    let Store = stores[name]
    _stores[name] = new Store(values[name])
    _stores[name].stores = _stores
  }
  return _stores
}
