import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'

import {
  fileService,
} from '~/common/services'
import BaseStore from './BaseStore'

export default class FileStore extends BaseStore {
  constructor(data) {
    super(data)
  }

  @observable files = null

  @observable dirPath = ''

  @observable loading = false

  @observable transition = null

  @computed get parentDir () {
    if (this.dirPath) {
      const paths = this.dirPath.split('/')
      paths.pop()
      return paths.length === 1 ? paths[0] : paths.join('/')
    }
    return null
  }

  @computed get dirName () {
    if (this.dirPath) {
      const paths = this.dirPath.split('/')
      return paths.pop()
    }
    return ''
  }

  changeDir = async (dirPath) => {
    if (this.dirPath !== dirPath && this.loading === false) {
      const transition = dirPath.length > this.dirPath.length ? 'sfr' : 'rfr'
      await this.readDir(dirPath, transition)
    }
  }

  refreshDir = async (dirPath) => {
    if (this.loading === false) {
      await this.readDir(dirPath || '')
    }
  }

  readDir = async (dirPath, transition = null) => {
    const {
      restUrl,
    } = this.stores.configStore

    this.loading = true
    try {
      const files = await fileService.readDir({
        urlPrefix: restUrl,
        dirPath,
      })
      this.loading = false
      runInAction(() => {
        this.files = files
        this.transition = files.length > 50 ? 'fade' : transition
        this.dirPath = dirPath
      })
    } catch (e) {
      this.loading = false
      throw e
    }
  }

  remove = async (dirPath, files, forever) => {
    const {
      restUrl,
    } = this.stores.configStore

    this.loading = true
    try {
      return await fileService.remove({
        urlPrefix: restUrl,
        dirPath,
        files,
        forever,
      })
    } catch (e) {
      throw e
    } finally {
      this.loading = false
    }
  }

  upload = async (dirPath, files) => {
    const {
      restUrl,
    } = this.stores.configStore

    this.loading = true
    try {
      return await fileService.upload({
        urlPrefix: restUrl,
        dirPath,
        files,
      })
    } catch (e) {
      throw e
    } finally {
      this.loading = false
    }
  }

  makeDir = async (dirPath, dirName) => {
    const {
      restUrl,
    } = this.stores.configStore

    this.loading = true
    try {
      return await fileService.make({
        urlPrefix: restUrl,
        dirPath,
        dirName,
      })
    } catch (e) {
      throw e
    } finally {
      this.loading = false
    }
  }
}
