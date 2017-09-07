import 'es6-promise/auto'
import fetch from 'isomorphic-fetch'

export default function (url, {
  timeout = 1000 * 60,
  ...opts,
} = {}) {
  return Promise.race([fetch(url, {
    credentials: 'same-origin',
    ...opts,
  }).then(response => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json().then(result => {
      if (result.errMsg) {
        throw new Error(result.errMsg)
      }
      return result
    })
  }), new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request time out'))
    }, timeout)
  })])
}
