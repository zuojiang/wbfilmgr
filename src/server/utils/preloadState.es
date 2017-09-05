export default async function (...args) {
  let state = args.shift()
  const routes = args.shift()

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
