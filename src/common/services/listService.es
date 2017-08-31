import fetch from '~/common/utils/fetch'

export async function queryItems ({
  urlPrefix,
  headers,
} = {}) {
  const { data } = await fetch(`${urlPrefix}/test?action=queryItems`, {
    headers,
  })
  return data
}

export async function addItem () {
  const { data } = await fetch('/test', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'addItem'
    })
  })
  return data
}
