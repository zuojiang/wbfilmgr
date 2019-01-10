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
  Group,
  Modal,
  Field,
  ButtonGroup,
  Button,
} from 'amazeui-touch'

import BaseModal from '../BaseModal'

@observer
export default class UploadFileModal extends BaseModal {
  constructor(props) {
    super(props)
  }

  list = []

  upload () {
    let files = []
    for(let input of this.list) {
      if (!input) {
        continue
      }
      for(let file of input.files) {
        files.push(file)
      }
    }
    if (files.length) {
      this.props.onUpload(files)
    }
  }

  render () {
    this.list = []
    return <Modal
      role='popup'
      title='Upload Files'
      isOpen={this.visible}
      onClosed={() => this.onClosed && this.onClosed()}
      onDismiss={() => this.close()}
    >
      <Container direction='column' fill>
        <Container scrollable>
          <Group header='*/*'>
            <input ref={el => this.list.push(el)}
              type="file"
              multiple
            />
          </Group>
          <Group header='image/*'>
            <input ref={el => this.list.push(el)}
              type="file"
              accept='image/*'
              multiple
            />
          </Group>
          <Group header='text/*'>
            <input ref={el => this.list.push(el)}
              type="file"
              accept='text/*'
              multiple
            />
          </Group>
        </Container>
        <ButtonGroup>
          <Button amStyle="primary" block
            onClick={() => this.upload()}
          >Upload</Button>
        </ButtonGroup>
      </Container>
    </Modal>
  }
}
