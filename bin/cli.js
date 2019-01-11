#!/usr/bin/env node

process.env.NODE_ENV = 'production'
const yargs = require('yargs')
const fs = require('fs')
const run = require('../out/server/index.js').default
const checkForUpdate = require('../out/server/checkForUpdate.js').default

const {
  _: [rootDir],
  notCheckUpdate,
  ...options
} = yargs.options({
  'http-port': {
    alias: 'p',
    describe: 'HTTP port',
    type: 'number',
  },
  'not-check-update': {
    describe: 'Don\'t check latest version',
    type: 'boolean',
  }
})
.strict(true)
.argv

run({
  ...options,
  rootDir,
}).then(app => {
  if (!notCheckUpdate) {
    checkForUpdate()
  }
})
