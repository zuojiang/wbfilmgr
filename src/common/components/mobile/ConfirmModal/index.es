import React from 'react'
import { observable, computed, action, runInAction, toJS } from 'mobx'
import { inject, observer, Observer } from 'mobx-react'
import { Container, Modal, Field, Button } from 'amazeui-touch'

import BaseModal from '../BaseModal'

@observer
export default class ConfirmModal extends BaseModal {
  constructor(props) {
    super(props)
  }

  field = null

  render() {
    const {
      onAction,
      title = 'Delete File',
      desc = 'Are you sure?',
      confirmText = 'Delete',
      cancelText = 'Cancel',
    } = this.props
    return (
      <Modal
        role="confirm"
        title={title}
        confirmText={confirmText}
        cancelText={cancelText}
        isOpen={this.visible}
        onDismiss={() => this.close()}
        onAction={evt => onAction(evt)}
      >
        {desc}
      </Modal>
    )
  }
}
