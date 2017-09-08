import Path from 'path'
import express from 'express'
import fs from 'fs-extra-promise'
import prettyBytes from 'pretty-bytes'
import Busboy from 'busboy'
import del from 'del'
import trash from 'trash'

const router = express.Router()
const cwd = process.cwd()

router.use((req, res, next) => {
  res.locals.absPath = Path.join(cwd, req.body.dirPath || req.query.dirPath || '')
  next()
})

router.post('/upload', (req, res, next) => {
  const {headers} = req
  const {absPath} = res.locals

  const busboy = new Busboy({
    headers,
  })

  let data = 0
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.pipe(fs.createWriteStream(Path.join(absPath, filename), {
      defaultEncoding: encoding,
    }))
    data++
  })

  busboy.on('finish', () => {
    res.set({ 'Connection': 'close' })
    res.json({data})
  })

   req.pipe(busboy)
})

router.get('/list', async (req, res, next) => {
  const {absPath} = res.locals

  try {
    const files = await fs.readdirAsync(absPath)
    let data = []
    for(let filename of files) {
      let stats = await fs.statAsync(Path.join(absPath, filename))
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
  const {absPath} = res.locals
  const {
    files,
    forever,
  } = req.body

  if (files && files.length > 0) {
    const remove = forever ? del : trash
    const paths = files.map(filename => Path.join(absPath, filename))
    try {
      const data = await remove(paths)
      res.json({data})
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

  const data = await fs.mkdirp(Path.join(absPath, dirName))
  console.dir(data)
  res.json({data:1})
})

// router.put('/rename', async (req, res, next) => {
//
// })

router.use((err, req, res, next) => {
  res.json({
    errMsg: err.message,
  })
})

export default router
