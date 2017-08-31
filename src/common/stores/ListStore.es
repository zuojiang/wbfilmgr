import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'

import {
  listService,
} from '~/common/services'

export default class ListStore {
  constructor(data) {
    for(let name in data) {
      this[name] = data[name]
    }
  }

  @observable items = null

  addItem = async () => {
    this.items.push(await listService.addItem())
  }
}
