import React from 'react'
import ReactDOM from 'react-dom'
import {
  Router,
  browserHistory,
} from 'react-router'
import {
  Provider,
} from 'mobx-react'

import routes from '~/common/components/routes'
import {
  createStores,
} from '~/common/stores'

ReactDOM.render(<Provider {...createStores(global.appData.state)}>
  <Router history={browserHistory} routes={routes} />
</Provider>, document.getElementById('root'))
