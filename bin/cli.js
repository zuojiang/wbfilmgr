#!/usr/bin/env node

process.env.NODE_ENV = 'production'
const yargs = require('yargs')
const fs = require('fs')
const app = require('../out/server/index.js').default

const path = yargs.argv._[0]

if (path) {
  const stat = fs.statSync(path)
  if (stat.isDirectory()) {
    app.set('cwd', path)
  }
}

console.log('\n%s\n', app.get('cwd'))
