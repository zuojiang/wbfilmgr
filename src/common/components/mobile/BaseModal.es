import React, { Component } from 'react'
import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
} from 'mobx'

export default class BaseModal extends Component {
  constructor(props) {
    super(props)
  }

  @observable visible = false

  @observable onClosed = null

  open () {
    this.visible = true
  }

  @action close (onClosed = null) {
    this.onClosed = onClosed
    this.visible = false
  }
}
