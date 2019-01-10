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
    credentials: 'same-origin',
    ...opts,
  }
  return (file ? postFile(url, file, options) : fetch(url, options))
  .then(response => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json().then(result => {
      if (result.errMsg) {
        throw new Error(result.errMsg)
      }
      return result
    })
  }).catch(err => {
    console.error(err);
    alert(err.message)
    throw err
  })
}
