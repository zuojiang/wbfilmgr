import React from 'react'
import ReactDOM from 'react-dom'
import {
  Router,
  browserHistory,
} from 'react-router'
import {
  Provider,
} from 'mobx-react'

import returnRoutes from '~/common/components/returnRoutes'
import createStores from '~/common/stores/createStores'

const {
  state,
  userAgent,
} = global.appData

ReactDOM.render(<Provider {...createStores(state)}>
  <Router history={browserHistory} routes={returnRoutes(userAgent)} />
</Provider>, document.getElementById('root'))
