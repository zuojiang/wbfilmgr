export default async function (...args) {
  const routes = args.shift()
  let state = {}

  for(let {
    path,
    component: {
      getPreloadedState,
    }
  } of routes) {
    if (getPreloadedState) {
      state = await getPreloadedState(...[path, state].concat(args))
    }
  }

  return state
}
