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
export default class UploadFileModal extends BaseModal {
  constructor(props) {
    super(props)
  }

  input = null

  upload () {
    const files = this.input.files
    if (files.length) {
      this.props.onUpload(files)
    }
  }

  render () {
    return <Modal
      role='popup'
      title='Upload Files'
      isOpen={this.visible}
      onClosed={() => this.onClosed && this.onClosed()}
      onDismiss={() => this.close()}
    >
      <Container scrollable>
        <input ref={el => this.input = el}
          type="file"
          accept="image/*"
          multiple
        />
        <Button amStyle="primary" block
          onClick={() => this.upload()}
        >Upload</Button>
      </Container>
    </Modal>
  }
}
