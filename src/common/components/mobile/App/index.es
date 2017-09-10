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
          <NavBar title={dirName || 'File Manager'}
            amStyle='primary'
            leftNav={parentDir !== null ? [{
              component: Link,
              icon: 'left-nav',
              onClick: () => {
                changeDir(parentDir).catch(err => alert(err.message))
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
                      birthtime,
                    }, i) => {
                      let filePath
                      if (dirPath) {
                        filePath = dirPath + '/' + filename
                      } else {
                        filePath = filename
                      }

                      if (type === 'directory') {
                        return <List.Item key={filePath}
                          title={filename}
                          linkComponent={Link}
                          linkProps={{
                            onClick: () => {
                              changeDir(filePath).catch(err => alert(err.message))
                            }
                          }}
                        />
                      } else if (type === 'file') {
                        return <List.Item key={filePath}
                          title={filename}
                          after={<DownloadLink fileName={filename} size={size} />}
                        />
                      } else {
                        return <List.Item key={filePath}
                          title={filename}
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
            if (length > 0) {
              this.selectFileModal.close(() => {
                readDir(dirPath)
              })
            } else {
              alert('No files have been removed!')
            }
          }, err => {
            alert(err.message)
          })
        }}
      />
      <UploadFileModal ref={el => this.uploadFileModal = el}
        onUpload={files => {
          upload(dirPath, files).then(length => {
            this.uploadFileModal.close(() => {
              length > 0 && readDir(dirPath)
            })
          }, err => {
            alert(err.message)
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
            }, err => {
              alert(err.message)
            })
          }
        }}
      />
      <Modal role='loading' isOpen={loading} />
    </Container>
  }
}

@inject('configStore', 'fileStore')
@observer
class DownloadLink extends Component {
  constructor (props) {
    super(props)
  }

  render () {

    const {
      fileName,
      size,
      fileStore: {
        dirPath,
      },
      configStore: {
        restUrl,
      },
    } = this.props

    let url = restUrl +'/download?'+ qs.stringify({
      fileName,
      dirPath,
    })

    return <div>
      <span className={css.fileSize}>{size}</span>
      <a className='item-icon icon' href={url}>
        <Icon name='download' />
      </a>
    </div>
  }
}
