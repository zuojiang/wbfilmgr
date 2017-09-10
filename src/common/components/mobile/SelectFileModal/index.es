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
  List,
  Field,
  ButtonGroup,
  Button,
  Icon,
} from 'amazeui-touch'

import BaseModal from '../BaseModal'
import css from './style.css'

@observer
export default class SelectFileModal extends BaseModal {
  constructor(props) {
    super(props)
  }

  @observable files = null

  @action open (files) {
    this.files = files
    this.visible = true
  }

  list = []

  remove (forever) {
    let files = this.list.filter(({field}) => field.getChecked())
    files = files.map(({file}) => file.filename)
    this.props.onDelete({files, forever})
  }

  render () {
    this.list = []
    return <Modal
        role='popup'
        title='Select Files'
        isOpen={this.visible}
        className={css.popup}
        onClosed={() => this.onClosed && this.onClosed()}
        onDismiss={() => this.close()}
      >
        <Container direction='column' fill>
          <Container scrollable>
            <List>
              {
                this.files && this.files.map((file, i) => {
                  return <List.Item
                    nested="checkbox"
                    key={i}
                  >
                    <Field
                      ref={field => {
                        if (field) {
                          this.list.push({
                            field,
                            file,
                          })
                        }
                      }}
                      label={file.filename}
                      type="checkbox"
                    />
                  </List.Item>
                })
              }
            </List>
          </Container>
          <ButtonGroup justify>
            <Button amStyle='warning' onClick={() => this.remove(false)}>Move To Trash</Button>
            <Button amStyle='alert' onClick={() => this.remove(true)}>Delete</Button>
          </ButtonGroup>
        </Container>
    </Modal>
  }
}
