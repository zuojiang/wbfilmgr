import React, { Component } from 'react'
import { Link } from 'react-router'
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
      refreshDir,
      remove,
      upload,
      makeDir,
      previewUrl,
    } = fileStore

    const files = toJS(fileStore.files)

    return <Container fill direction='column'>
      <Container transition={transition || 'none'}>
        <View key={dirPath}>
          <NavBar title={dirName || 'File Manager'}
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
              icon: 'refresh',
              onClick: () => {
                refreshDir(dirPath)
              }
            }, {
              component: Link,
              icon: 'more',
              onClick: () => {
                fileStore.directoryActionSheetModal.open()
              }
            }]}
          />
          <Container scrollable>
            <Group header={dirPath || null} noPadded>
              {
                files && files.length > 0 ? <List>
                  {
                    files.map((file, i) => {
                      let {
                        fileName,
                        type,
                        size,
                        birthtime,
                      } = file
                      let filePath
                      if (dirPath) {
                        filePath = dirPath + '/' + fileName
                      } else {
                        filePath = fileName
                      }

                      if (type === 'directory') {
                        return <List.Item key={filePath}
                          title={fileName}
                          linkComponent={Link}
                          linkProps={{
                            onClick: () => {
                              changeDir(filePath)
                            }
                          }}
                        />
                      } else if (type === 'file') {
                        return <List.Item key={filePath}
                          title={fileName}
                          linkComponent={Link}
                          linkProps={{
                            className: css.noNav,
                            onClick: () => {
                              fileStore.currentFile = file
                              fileStore.fileActionSheetModal.open()
                            }
                          }}
                          after={<span className={css.fileSize}>{size}</span>}
                        />
                      } else {
                        return <List.Item key={filePath}
                          title={fileName}
                        />
                      }
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
      <ActionSheetModal ref={el => fileStore.directoryActionSheetModal = el}>
        <List>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              fileStore.directoryActionSheetModal.close(() => {
                this.makeDirPromptModal.open()
              })
            }}>New Folder</Link>
          </List.Item>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              fileStore.directoryActionSheetModal.close(() => {
                this.uploadFileModal.open()
              })
            }}>Upload Files</Link>
          </List.Item>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              fileStore.directoryActionSheetModal.close(() => {
                this.selectFileModal.open(files)
              })
            }}>Select</Link>
          </List.Item>
        </List>
      </ActionSheetModal>
      <ActionSheetModal ref={el => fileStore.fileActionSheetModal = el}>
        <List>
          <List.Item>
            <Link className={css.actionSheetLink} href={previewUrl} 
              target='_blank'>Preview</Link>
          </List.Item>
          <List.Item>
            <Link className={css.actionSheetLink} onClick={() => {
              fileStore.fileActionSheetModal.close(() => {
                fileStore.download()
              })
            }}>Download</Link>
          </List.Item>
        </List>
      </ActionSheetModal>
      <SelectFileModal ref={el => this.selectFileModal = el}
        onDelete={({files, forever}) => {
          remove(dirPath, files, forever).then(length => {
            if (length > 0) {
              this.selectFileModal.close(() => {
                readDir(dirPath)
              })
            } else {
              alert('No files have been removed!')
            }
          })
        }}
      />
      <UploadFileModal ref={el => this.uploadFileModal = el}
        onUpload={files => {
          upload(dirPath, files).then(length => {
            this.uploadFileModal.close(() => {
              if (length == 0) {
                alert('No files have been uploaded!')
              } else {
                readDir(dirPath)
                const failCount = files.length - length
                if (failCount) {
                  alert(`${length} success, ${failCount} failure`)
                }
              }
            })
          })
        }}
      />
      <PromptModal ref={el => this.makeDirPromptModal = el}
        title='New Folder'
        desc='Enter the path for the new folder.'
        onAction={dirName => {
          if (dirName === null) {
            this.makeDirPromptModal.close()
          } else if (dirName) {
            makeDir(dirPath, dirName).then(length => {
              this.makeDirPromptModal.close(() => {
                length > 0 && readDir(dirPath)
              })
            })
          }
        }}
      />
      <Modal role='loading' isOpen={loading} />
    </Container>
  }
}
