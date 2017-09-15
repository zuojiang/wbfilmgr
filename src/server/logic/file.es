import Path from 'path'
import express from 'express'
import fs from 'fs-extra-promise'
import prettyBytes from 'pretty-bytes'
import contentDisposition from 'content-disposition'
import qs from 'qs'
import Busboy from 'busboy'
import del from 'del'
import trash from 'trash'

const router = express.Router()

router.use((req, res, next) => {
  const cwd = req.app.get('cwd')
  res.locals.absPath = Path.join(cwd, req.body.dirPath || req.query.dirPath || '')
  next()
})

router.get('/list', async (req, res, next) => {
  const {absPath} = res.locals

  try {
    const files = await fs.readdirAsync(absPath)
    let data = [], stats
    for(let filename of files) {
      try {
        stats = await fs.statAsync(Path.join(absPath, filename))
        data.push({
          filename,
          type: stats.isDirectory() ? 'directory' : 'file',
          order: stats.isDirectory() ? 1 : 2,
          size: prettyBytes(stats.size),
          birthtime: stats.birthtime,
          modifytime: stats.mtime,
        })
      } catch (e) {
        data.push({
          filename,
          type: 'other',
          order: 3,
        })
      }
    }
    data.sort((a, b) => {
      if (a.order < b.order) {
        return -1
      } else if (a.order > b.order) {
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
    let paths = files.map(filename => Path.join(absPath, filename))
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

// router.put('/rename', async (req, res, next) => {
//
// })

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

router.get('/download', (req, res, next) => {
  const {absPath} = res.locals
  const {
    fileName,
  } = req.query

  res.sendFile(Path.join(absPath, fileName), {
    dotfiles: 'allow',
    headers: {
      'Content-Disposition': contentDisposition(fileName),
    }
  })
})

router.use((err, req, res, next) => {
  if (req.url.indexOf('/download') === 0) {
    const {
      dirPath,
    } = req.query
    res.redirect((res.app.locals.baseUrl || '/') + qs.stringify({
      dirPath,
    }, {
      addQueryPrefix: true,
    }))
  } else {
    res.json({
      errMsg: err.message,
    })
  }
})

export default router
