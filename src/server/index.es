import path from 'path'
import express from 'express'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import session from 'express-session'
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

import routes from '~/common/components/routes'
import {
  createStores,
} from '~/common/stores'
import preloadState from './utils/preloadState'

useStaticRendering(true)

const {
  httpPort,
  baseUrl,
  sessionSecret,
} = require(path.join(process.cwd(), 'config'))

const app = express()
const env = app.get('env')
app.set('x-powered-by', false)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.engine('pug', pug.__express)

app.locals = {
  baseUrl,
}

if (env === 'development') {
  app.locals.pretty = true
  app.use([
    '/res/js/bundle.js',
    '/res/js/bundle.js.map',
    '/res/css/bundle.css',
    '/res/css/bundle.css.map',
  ], proxy({
    target: 'http://127.0.0.1:3200',
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*'
    },
    pathRewrite: {},
    headers: {},
  }))
}

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public'), {
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

app.use(require('./logic/test').default)

app.use((req, res, next) => {
  match({
    routes,
    location: req.url,
  }, async (err, redirectLocation, renderProps) => {
    if (err) {
      next(err)
    } else if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const appState = await preloadState(renderProps.routes, req)
      const appHtml = ReactDOMServer.renderToString(
        <Provider {...createStores(appState)}>
           <RouterContext {...renderProps} />
        </Provider>
      )
      res.render('index', {
        appHtml,
        appState,
      })
    } else {
      next()
    }
  })
})

app.listen(httpPort)
