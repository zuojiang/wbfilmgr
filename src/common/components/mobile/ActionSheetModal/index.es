import React from 'react'
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

import BaseModal from '../BaseModal'

@observer
export default class ActionSheetModal extends BaseModal {
  constructor(props) {
    super(props)
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
