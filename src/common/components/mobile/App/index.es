import React, { Component } from 'react'
import { Link } from 'react-router'
import qs from 'qs'
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
  View,
  Group,
  NavBar,
  Modal,
  List,
  TabBar,
  Icon,
  Badge,
  Field,
} from 'amazeui-touch'

import css from './style.css'
import {
  fileService,
} from '~/common/services/'

import ActionSheetModal from '../ActionSheetModal'
import SelectFileModal from '../SelectFileModal'
import UploadFileModal from '../UploadFileModal'
import PromptModal from '../PromptModal'

@inject('configStore', 'fileStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  transition = 'sfr'

  actionSheetModal = null

  selectFileModal = null

  uploadFileModal = null

  makeDirPromptModal = null

  static getPreloadedState = async (path, state, {
    query: {
      dirPath,
    },
    urlPrefix,
    headers,
  }) => {
    const files = await fileService.readDir({
      urlPrefix,
      dirPath,
      headers,
    })
    return {
      ...state,
      fileStore: {
        dirPath,
        files,
      }
    }
  }

  render () {
    const {
      fileStore,
      configStore: {
        baseUrl,
      },
    } = this.props

    const {
      loading,
      dirPath,
      transition,
      parentDir,
      dirName,
      readDir,
      changeDir,
      remove,
      upload,
      makeDir,
    } = fileStore

    const files = toJS(fileStore.files)

    return <Container fill direction='column'>
      <Container transition={transition || 'none'}>
        <View key={dirPath}>
          <NavBar title={dirName || 'File Explorer'}
            amStyle='primary'
            leftNav={parentDir !== null ? [{
              component: Link,
              icon: 'left-nav',
              onClick: () => {
                changeDir(parentDir)
              },
            }] : null}
            rightNav={[{
              component: Link,
              icon: 'more',
              onClick: () => {
                this.actionSheetModal.open()
              }
            }]}
          />
          <Container scrollable>
            <Group header={dirPath || null} noPadded>
              {
                files && files.length > 0 ? <List>
                  {
                    files.map(({
                      filename,
                      type,
                      size,
                    }, i) => {
                      let filePath
                      if (dirPath) {
                        filePath = dirPath + '/' + filename
                      } else {
                        filePath = filename
                      }
                      return <List.Item key={filePath}
                        title={filename}
                        linkComponent={type === 'directory' ? Link : null}
                        linkProps={{
                          onClick: () => {
                            changeDir(filePath)
                          }
                        }}
                      />
                    })
                  }
                </List> : null
              }
            </Group>
          </Container>
        </View>
      </Container>
      {/* <TabBar>
        <TabBar.Item selected icon="list" />
        <TabBar.Item icon="info" badge={0} />
      </TabBar> */}
      <ActionSheetModal ref={el => this.actionSheetModal = el}>
        <List>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              this.actionSheetModal.close(() => {
                this.makeDirPromptModal.open()
              })
            }}>New Folder</Link>
          </List.Item>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              this.actionSheetModal.close(() => {
                this.uploadFileModal.open()
              })
            }}>Upload Files</Link>
          </List.Item>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              this.actionSheetModal.close(() => {
                this.selectFileModal.open(files)
              })
            }}>Select</Link>
          </List.Item>
        </List>
      </ActionSheetModal>
      <SelectFileModal ref={el => this.selectFileModal = el}
        onDelete={({files, forever}) => {
          remove(dirPath, files, forever).then(length => {
            this.selectFileModal.close(() => {
              readDir(dirPath)
            })
          })
        }}
      />
      <UploadFileModal ref={el => this.uploadFileModal = el}
        onUpload={files => {
          upload(dirPath, files).then(length => {
            this.uploadFileModal.close(() => {
              readDir(dirPath)
            })
          })
        }}
      />
      <PromptModal ref={el => this.makeDirPromptModal = el}
        title='New Folder'
        desc='Enter the path for the new folder.'
        onAction={dirName => {
          makeDir(dirPath, dirName).then(() => {
            this.makeDirPromptModal.close(() => {
              readDir(dirPath)
            })
          })
        }}
      />
      <Modal role='loading' isOpen={loading} />
    </Container>
  }
}
