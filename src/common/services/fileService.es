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
  let count = 0
  let promise = Promise.resolve()
  for (const file of files) {
    promise = promise.then(() => fetch(urlPrefix + '/upload?' + qs.stringify({
      dirPath,
    }), {
      file,
      timeout: 0,
      // chunkSize: 1024,
      retryMaxCount: 0,
    }).then(({data}) => {
      count += data
    }))
  }
  await promise
  return count
}
