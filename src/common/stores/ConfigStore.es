import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'

import BaseStore from './BaseStore'

export default class ConfigStore extends BaseStore {
  constructor(data) {
    super(data)
  }

  @observable baseUrl = ''
  @observable restUrl = ''
  @observable gmSupport = false
}
