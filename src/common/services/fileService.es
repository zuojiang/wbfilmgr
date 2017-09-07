import fetch from '~/common/utils/fetch'

export async function readDir (url, opts) {
  const { data } = await fetch(url, opts)
  return data
}
