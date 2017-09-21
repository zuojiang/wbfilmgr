import latestVersion from 'latest-version'
import compare from 'semver-compare'
import clc from 'cli-color'
import boxen from 'boxen'

import pkg from '~/../package.json'

export default async function(){
  const version = await latestVersion(pkg.name)
  if (compare(version, pkg.version) > 0) {
    let msg = `
Please update to latest version (${version}).

${clc.bold('Update')}

  $ npm install ${pkg.name}@latest -g
    `
    msg = boxen(msg, {
      padding: 1,
      margin: {
        top: 1,
        bottom: 1,
      }
    })
    msg = clc.greenBright(msg)
    console.log(msg)
  }
}
