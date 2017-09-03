import React, { Component } from 'react'
import {
  observable,
  inject,
  observer,
  Observer,
} from 'mobx-react'
import {
  Layout,
  Menu,
  Breadcrumb,
} from 'antd'

import {
  listService,
} from '~/common/services'
import css from './style.css'

// @inject('listStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  // static getPreloadedState = async (path, state, serverInfo) => {
  //   return {
  //     ...state,
  //   }
  // }

  render () {
    return <Layout className={css.layout}>
      <Layout.Header>
      header
      </Layout.Header>
      <Layout.Content>
content
      </Layout.Content>
      <Layout.Footer>
footer
      </Layout.Footer>
    </Layout>
  }
}
