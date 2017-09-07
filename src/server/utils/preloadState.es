export default async function (state, routes, ...args) {
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
