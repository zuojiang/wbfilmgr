import 'es6-promise/auto'
import fetch from 'isomorphic-fetch'

const {
  baseUrl,
  restUrl,
} = global.appData || {}

export default function (url, opts = {}) {
  if (!/^(http|https):\/\//i.test(url)) {
    url = (restUrl || baseUrl || '') + url
  }

  return fetch(url, {
    credentials: 'same-origin',
    ...opts,
  })
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
}
