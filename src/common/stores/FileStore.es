import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'

import {
  fileService,
} from '~/common/services'

export default class FileStore {
  constructor(data) {
    for(let name in data) {
      this[name] = data[name]
    }
  }

  @observable files = null

  @observable dirPath = null

  @observable loading = false

  readDir = async (restUrl, path) => {
    const timer = setTimeout(() => {
      this.loading = true
    }, 100)
    const files = await fileService.readDir(restUrl + path)
    clearTimeout(timer)
    runInAction(() => {
      this.files = files
      this.dirPath = path
      this.loading = false
    })
  }
}
