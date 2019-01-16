import Path from 'path'
import express from 'express'
import fs from 'fs-extra-promise'
import prettyBytes from 'pretty-bytes'
import qs from 'qs'
import Busboy from 'busboy'
import del from 'del'
import trash from 'trash'
import hidefile from 'hidefile'
import pify from 'pify'
import fileSlicer from 'file-slicer'

import ignore from '../utils/ignore'

const router = express.Router()

router.use((req, res, next) => {
  const {rootDir} = res.app.locals
  res.locals.absPath = Path.join(rootDir, req.body.dirPath || req.query.dirPath || '')
  next()
})

router.get('/list', async (req, res, next) => {
  const {rootDir} = res.app.locals
  const {absPath} = res.locals

  const isIgnore = await ignore(rootDir)

  try {
    const files = await fs.readdirAsync(absPath)
    let data = []
    for(let fileName of files) {
      const filePath = Path.join(absPath, fileName)
      if (fileName == 'lost+found' || isIgnore(filePath)) {
        continue
      }
      try {
        const hidden = await pify(hidefile.isHidden)(filePath)
        const stats = await fs.statAsync(filePath)
        data.push({
          fileName,
          type: stats.isDirectory() ? 'directory' : 'file',
          size: prettyBytes(stats.size),
          birthtime: stats.birthtime,
          modifytime: stats.mtime,
          hidden,
          _order: stats.isDirectory() ? 1 : 2,
        })
      } catch (e) {
        data.push({
          fileName,
          type: 'other',
          _order: 3,
        })
      }
    }
    data.sort((a, b) => {
      if (a._order < b._order) {
        return -1
      } else if (a._order > b._order) {
        return 1
      }
      return a.fileName > b.fileName ? 1 : -1
    })
    res.json({data})
  } catch (e) {
    next(e)
  }
})

router.delete('/remove', async (req, res, next) => {
  const {absPath} = res.locals
  const {
    files,
    forever,
  } = req.body

  if (files && files.length > 0) {
    const remove = forever ? del : trash
    let paths = files.map(fileName => Path.join(absPath, fileName))
    try {
      paths = await remove(paths)
      let data = 0
      if (paths) {
        data = paths.length
      } else if (paths === '') {
        // windows
        data = 1
      }
      res.json({
        data,
      })
    } catch(e) {
      next(e)
    }
  } else {
    res.json({data: 0})
  }
})

router.put('/make', async (req, res, next) => {
  const {absPath} = res.locals
  const {
    dirName,
  } = req.body

  if (dirName) {
    try {
      await fs.mkdirpAsync(Path.join(absPath, dirName))
      res.json({data:1})
    } catch (e) {
      next(e)
    }
  } else {
    res.jons({data: 0})
  }
})

router.put('/rename', async (req, res, next) => {
  const {absPath} = res.locals
  const {
    oldName,
    newName,
  } = req.body
  try {
    const oldPath = Path.join(absPath, oldName)
    const newPath = Path.join(absPath, newName)
    await fs.renameAsync(oldPath, newPath)
    res.json({data:1})
  } catch (e) {
    next(e)
  }
})

router.post('/upload', fileSlicer.middleware({
  returnAbsPath ({req, res, name, id}) {
    const {absPath} = res.locals
    return Path.join(absPath, name)
  }
}), (req, res) => {
  res.json({data: req.files.length})
})

router.get('/download', (req, res, next) => {
  const {absPath} = res.locals
  const {
    fileName,
  } = req.query

  res.download(Path.join(absPath, fileName), fileName, {
    dotfiles: 'allow',
  }, err => {
    if (err) {
      res.end()
    }
  })
})

router.use((err, req, res, next) => {
  res.json({
    errMsg: err.message,
  })
})

export default router
