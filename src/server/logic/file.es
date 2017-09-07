import Path from 'path'
import express from 'express'
import fs from 'fs-extra-promise'
import prettyBytes from 'pretty-bytes'

const router = express.Router()
const cwd = process.cwd()

router.use((req, res, next) => {
  res.locals.path = Path.join(cwd, req.query.dirPath || '')
  next()
})

// router.post('/upload', (req, res, next) => {
//
// })

router.get('/list', async (req, res, next) => {
  const {path} = res.locals

  try {
    const files = await fs.readdirAsync(path)
    let data = []
    for(let filename of files) {
      let stats = await fs.statAsync(Path.join(path, filename))
      data.push({
        filename,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: prettyBytes(stats.size),
        birthtime: stats.birthtime,
        modifytime: stats.mtime,
      })
    }
    data.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') {
        return -1
      } else if (a.type === 'file' && b.type === 'directory') {
        return 1
      }
      return a.filename > b.filename ? 1 : -1
    })
    res.json({data})
  } catch (e) {
    next(e)
  }
})

router.delete('/remove', async (req, res, next) => {

})

router.post('/new', async (req, res, next) => {

})

router.put('/rename', async (req, res, next) => {

})

router.use((err, req, res, next) => {
  res.json({
    errMsg: err.message,
  })
})

export default router
