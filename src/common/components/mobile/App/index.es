import React, { Component } from 'react'
import {
  observable,
  inject,
  observer,
  Observer,
} from 'mobx-react'

import css from './style.css'
import {
  Button
} from 'amazeui-touch'

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return <div>
      <Button block>Default Block</Button>
      <Button amStyle="primary" block>Primary Block</Button>
    </div>
  }
}
