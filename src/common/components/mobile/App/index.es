import React, { Component } from 'react'
import {
  observable,
  inject,
  observer,
  Observer,
} from 'mobx-react'
import Layout from 'antd/lib/layout'

import css from './style.css'

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return <Layout className={css.layout}>
      <Layout.Header>header</Layout.Header>
      <Layout.Content>content</Layout.Content>
      <Layout.Footer>footer</Layout.Footer>
    </Layout>
  }
}
