import React, { Component } from 'react'
import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx'
import {
  inject,
  observer,
  Observer,
} from 'mobx-react'
import {
  Modal,
} from 'amazeui-touch'

@observer
export default class ActionSheetModal extends Component {
  constructor(props) {
    super(props)
  }

  modal = null

  @observable visible = false

  @observable onClosed = null

  open () {
    this.visible = true
  }

  @action close (onClosed = null) {
    this.onClosed = onClosed
    this.visible = false
  }

  render () {
    return <Modal
      role='actions'
      isOpen={this.visible}
      cancelText='Cancel'
      closeViaBackdrop
      onClosed={() => this.onClosed && this.onClosed()}
      onDismiss={() => this.close()}
    >
      <div className='modal-actions-group'>
        {this.props.children}
      </div>
    </Modal>
  }
}
