import fetch from '~/common/utils/fetch'

export async function readDir (url, headers) {
  const { data } = await fetch(url, {
    headers,
  })
  return data
}
