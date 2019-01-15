import React from 'react'
import {
  observable,
  computed,
  action,
  runInAction,
  toJS,
} from 'mobx'
import {
  inject,
  observer,
  Observer,
} from 'mobx-react'
import {
  Container,
  Modal,
  Field,
  Button,
} from 'amazeui-touch'

import BaseModal from '../BaseModal'

@observer
export default class PromptModal extends BaseModal {
  constructor(props) {
    super(props)
  }

  field = null

  render () {
    const {
      onAction,
      title,
      desc,
      confirmText = 'OK',
      cancelText = 'Cancel',
      placeholder = null,
    } = this.props
    return <Modal
      role='prompt'
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      isOpen={this.visible}
      onClosed={() => this.onClosed && this.onClosed()}
      onDismiss={() => this.close()}
      onAction={evt => onAction(evt)}
    >
      {desc}
      <Field placeholder={placeholder} ref={el => this.field = el} />
    </Modal>
  }
}
