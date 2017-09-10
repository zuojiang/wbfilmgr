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

export async function make ({
  urlPrefix,
  dirPath,
  dirName,
}) {
  const { data } = await fetch(urlPrefix + '/make', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dirPath,
      dirName,
    })
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

export async function upload ({
  urlPrefix,
  dirPath,
  files,
}) {
  const body = new FormData()
  for(let file of files) {
    body.append('files', file)
  }
  const { data } = await fetch(urlPrefix + '/upload?' + qs.stringify({
    dirPath,
  }), {
    method: 'post',
    body,
    timeout: 0,
  })
  return data
}
