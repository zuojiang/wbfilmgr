#!/usr/bin/env node

process.env.NODE_ENV = 'production'
const yargs = require('yargs')
const fs = require('fs')
const appPromise = require('../out/server/index.js').default
const checkForUpdate = require('../out/server/checkForUpdate.js').default

const path = yargs.argv._[0]

appPromise.then(app => {
  if (path) {
    const stat = fs.statSync(path)
    if (stat.isDirectory()) {
      app.set('cwd', path)
    }
  }

  console.log('')
  console.log(app.get('cwd'))

  checkForUpdate()
})
