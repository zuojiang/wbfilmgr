import qs from 'qs'
import fetch from '~/common/utils/fetch'

export async function readDir ({
  urlPrefix,
  dirPath,
  headers = {},
}) {
  const { data } = await fetch(urlPrefix + '/list?' + qs.stringify({
    dirPath,
  }), {
    headers,
  })
  return data
}

export async function remove ({
  urlPrefix,
  dirPath,
  files,
  forever = false,
}) {
  const { data } = await fetch(urlPrefix + '/remove', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dirPath,
      files,
      forever,
    })
  })
  return data
}
