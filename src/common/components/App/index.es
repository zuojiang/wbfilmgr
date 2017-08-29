import React, { Component } from 'react'
import {
  observable,
  inject,
  observer,
  Observer,
} from 'mobx-react'

import css from './style.css'

@inject('listStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    const {
      items,
      addItem,
    } = this.props.listStore

    return <div>
        <h2>App</h2>
        <button className={css.btn} onClick={evt => addItem()} >Add</button>
        <ul>
          {
            items.map((item, i) => {
              return <li key={i}>{item}</li>
            })
          }
        </ul>
    </div>
  }
}
