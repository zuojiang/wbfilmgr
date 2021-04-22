import Path from 'path'
import Url from 'url'
import os from 'os'
import express from 'express'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import serveHandler from 'serve-handler'
import session from 'express-session'
import useragent from 'express-useragent'
import basicAuth from 'express-basic-auth'
import portfinder from 'portfinder'
import pug from 'pug'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { RouterContext, match } from 'react-router'
import { Provider, useStaticRendering } from 'mobx-react'
import qrcode from 'qrcode-terminal'
import ip from 'ip'
import gm from 'gm'

import returnRoutes from '~/common/components/returnRoutes'
import createStores from '~/common/stores/createStores'
import preloadState from '~/server/utils/preloadState'

useStaticRendering(true)

const env = process.env.NODE_ENV || 'test'

async function main({
  rootDir = process.cwd(),
  httpPort = null,
  title = null,
  users = null,
  gmSupport = false,
} = {}) {
  rootDir = Path.normalize(rootDir)

  if (!httpPort) {
    httpPort = await portfinder.getPortPromise({
      port: 3000,
    })
  }

  if (!title) {
    title = Path.basename(rootDir) || os.hostname()
  }

  const baseUrl = ''
  const restUrl = '/rest'
  const app = express()

  app.set('x-powered-by', false)
  app.set('views', Path.join(__dirname, 'views'))
  app.set('view engine', 'pug')
  app.engine('pug', pug.__express)

  app.locals = {
    baseUrl,
    rootDir,
  }

  if (users) {
    app.use(
      basicAuth({
        users,
        challenge: true,
      })
    )
  }

  let publicDir
  if (env === 'development') {
    const webpack = require('webpack')
    const webpackDev = require('webpack-dev-middleware')
    app.locals.pretty = true
    const webpackConfig = require('../../webpack.config')
    webpackConfig.mode = 'development'
    app.use(
      webpackDev(webpack(webpackConfig), {
        logLevel: 'warn',
      })
    )
    publicDir = Path.resolve(__dirname, '../../public')
  } else {
    publicDir = Path.resolve(__dirname, 'public')
  }

  app.use(favicon(Path.join(publicDir, 'favicon.ico')))
  app.use(
    express.static(publicDir, {
      index: false,
    })
  )

  app.use('/image/resize', (req, res, next) => {
    const { dirPath, fileName, width = 48 } = req.query
    const filePath = Path.join(dirPath, fileName)
    gm(Path.join(rootDir, filePath))
      .resize(width)
      .noProfile()
      .stream((err, stdout, stderr) => {
        if (err) {
          next(err)
        } else {
          stdout.pipe(res)
        }
      })
  })

  app.use('/serve', (req, res, next) => {
    const { dirPath, fileName } = req.query
    req.url = Path.posix.join(dirPath, fileName)
    serveHandler(
      req,
      res,
      {
        public: rootDir,
        cleanUrls: false,
      },
      {
        sendError(
          absolutePath,
          response,
          acceptsJSON,
          current,
          handlers,
          config,
          err
        ) {
          next(err)
        },
      }
    )
  })

  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  )
  app.use(
    session({
      secret: 'wbfilmgr',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
      },
    })
  )
  app.use(useragent.express())

  app.use(restUrl, require('./logic/file').default)

  app.use((req, res, next) => {
    const { useragent: userAgent } = req
    match(
      {
        routes: returnRoutes(userAgent),
        location: req.url,
      },
      async (err, redirectLocation, renderProps) => {
        if (err) {
          next(err)
        } else if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
          const { protocol, headers, params, query, body, url } = req

          let urlPrefix
          if (/^(http|https):\/\//i.test(restUrl)) {
            urlPrefix = restUrl
          } else if (/^\/\/[^\/]/.test(restUrl)) {
            urlPrefix = `${protocol}:${restUrl}`
          } else {
            urlPrefix = Url.format({
              protocol: protocol + ':',
              hostname: '127.0.0.1',
              port: httpPort,
              pathname: restUrl ? Path.posix.normalize(restUrl) : null,
            })
          }

          try {
            const state = await preloadState(
              {
                configStore: {
                  baseUrl,
                  restUrl,
                  gmSupport,
                },
              },
              renderProps.routes,
              {
                urlPrefix,
                headers,
                params,
                query,
                body,
                url,
              }
            )
            const appHtml = ReactDOMServer.renderToString(
              <Provider {...createStores(state)}>
                <RouterContext {...renderProps} />
              </Provider>
            )
            res.render('index', {
              title,
              appHtml,
              appData: {
                state,
                userAgent,
              },
            })
          } catch (e) {
            next(e)
          }
        } else {
          next()
        }
      }
    )
  })

  return new Promise((resolve, reject) => {
    app.listen(httpPort, (...args) => {
      const url = `http://${ip.address()}:${httpPort}`
      if (env != 'development') {
        console.log('')
        qrcode.generate(url)
      }
      console.log('')
      console.log(url)
      resolve(app)
    })
  })
}

if (env == 'development') {
  main({
    rootDir: process.argv[2],
    gmSupport: true,
    // users: {admin: 'admin'},
  })
}

export default main
