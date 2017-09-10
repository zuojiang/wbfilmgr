export default class BaseStore {
  constructor(data) {
    for(let name in data) {
      if (typeof data[name] !== 'undefined') {
        this[name] = data[name]
      }
    }
  }
}
