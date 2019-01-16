import fs from 'fs'
import path from 'path'
import ignore from 'ignore'
import pify from 'pify'

const ignoreFiles = [
  '.gitignore',
  '.ignore',
]
const ig = ignore()

export default async function (rootDir) {
  for (let ignoreFile of ignoreFiles) {
    try {
      ignoreFile = path.join(rootDir, ignoreFile)
      const content = await pify(fs.readFile)(ignoreFile)
      ig.add(content.toString())
    } catch (e) {}
  }
  return filePath => ig.ignores(path.relative(rootDir, filePath))
}
