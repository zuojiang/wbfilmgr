import Path from 'path'
import Url from 'url'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import session from 'express-session'
import useragent from 'express-useragent'
import pug from 'pug'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {
  RouterContext,
  match,
} from 'react-router'
import {
  Provider,
  useStaticRendering,
} from 'mobx-react'

import returnRoutes from '~/common/components/returnRoutes'
import createStores from '~/common/stores/createStores'
import preloadState from '~/server/utils/preloadState'
import {
  httpPort,
  baseUrl,
  restUrl,
  sessionSecret,
} from '~/server.config'

useStaticRendering(true)

const app = express()
const env = app.get('env')
app.set('x-powered-by', false)
app.set('views', Path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.engine('pug', pug.__express)

app.locals = {
  baseUrl,
}

if (env === 'development') {
  app.locals.pretty = true
  const {
    devServer,
  } = require('../../webpack.config')
  app.use([
    '/res/js/bundle.js',
    '/res/js/bundle.js.map',
    '/res/css/bundle.css',
    '/res/css/bundle.css.map',
  ], proxy({
    target: `http://127.0.0.1:${devServer.port}`,
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*'
    },
    pathRewrite: {},
    headers: {},
  }))
}

app.use(favicon(Path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(Path.join(__dirname, 'public'), {
  index: false,
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  }
}))
app.use(useragent.express())

app.use(require('./logic/test').default)

app.use((req, res, next) => {
  const {
    useragent: userAgent
  } = req
  match({
    routes: returnRoutes(userAgent),
    location: req.url,
  }, async (err, redirectLocation, renderProps) => {
    if (err) {
      next(err)
    } else if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const {
        protocol,
        headers,
      } = req

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
        const state = await preloadState(renderProps.routes, {
          urlPrefix,
          headers,
        })
        const appHtml = ReactDOMServer.renderToString(
          <Provider {...createStores(state)}>
            <RouterContext {...renderProps} />
          </Provider>
        )
        res.render('index', {
          appHtml,
          appData: {
            state,
            userAgent,
            baseUrl,
            restUrl,
          },
        })
      } catch (e) {
        next(e)
      }
    } else {
      next()
    }
  })
})

app.listen(httpPort)
