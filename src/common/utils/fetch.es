import 'es6-promise/auto'
import fetch from 'isomorphic-fetch-improve'
import {postFile} from 'file-slicer'

export default function (url, {
  timeout = 1000 * 60,
  file = null,
  ...opts,
} = {}) {
  const options = {
    timeout,
    retryMaxCount: 5,
    retryDelay: 500,
    credentials: 'same-origin',
    ...opts,
  }
  return (file ? postFile(url, file, options) : fetch(url, options))
  .then(response => {
    if (response.status >= 400) {
      throw new Error(response.statusText);
    }
    return response.json().then(result => {
      if (result.errMsg) {
        throw new Error(result.errMsg)
      }
      return result
    })
  }).catch(err => {
    console.error(err);
    if (global.alert) {
      alert(err.message)
    } else {
      console.warn(url);
    }
    throw err
  })
}
