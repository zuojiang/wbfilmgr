import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'

import fetch from '~/common/utils/fetch'

export default class ListStore {
  constructor(data) {
    for(let name in data) {
      this[name] = data[name]
    }
  }

  @observable items = null

  addItem = async () => {
    const {
      data,
    } = await fetch('/test', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'addItem'
      })
    })

    this.items.push(data)
  }
}
