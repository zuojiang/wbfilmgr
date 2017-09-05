import 'es6-promise/auto'
import fetch from 'isomorphic-fetch'

export default function (url, opts = {}) {
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
