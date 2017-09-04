import React, { Component } from 'react'
import {
  observable,
  inject,
  observer,
  Observer,
} from 'mobx-react'

import css from './style.css'

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return <div>
      desktop
    </div>
  }
}
