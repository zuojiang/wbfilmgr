import React, { Component } from 'react'
import {
  observable,
  inject,
  observer,
  Observer,
} from 'mobx-react'

import {
  listService,
} from '~/common/services'
import css from './style.css'

@inject('listStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  static getPreloadedState = async (path, state, serverInfo) => {
    return {
      ...state,
      listStore: {
        items: await listService.queryItems(serverInfo),
      }
    }
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
