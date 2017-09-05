import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'

export default class ConfigStore {
  constructor(data) {
    for(let name in data) {
      this[name] = data[name]
    }
  }

  baseUrl = ''
  restUrl = ''
}
