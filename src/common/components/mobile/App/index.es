import React, { Component } from 'react'
import { Link } from 'react-router'
import { observable, computed, action, runInAction, toJS } from 'mobx'
import { inject, observer, Observer } from 'mobx-react'
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
import mime from 'mime'
import qs from 'qs'

import css from './style.css'
import { fileService } from '~/common/services/'

import ActionSheetModal from '../ActionSheetModal'
import UploadFileModal from '../UploadFileModal'
import ConfirmModal from '../ConfirmModal'
import PromptModal from '../PromptModal'

@inject('configStore', 'fileStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  transition = 'sfr'

  uploadFileModal = null

  makeDirPromptModal = null

  renamePromptModal = null

  deleteConfirmModal = null

  trashConfirmModal = null

  static getPreloadedState = async (
    path,
    state,
    { query: { dirPath }, urlPrefix, headers }
  ) => {
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
      },
    }
  }

  render() {
    const {
      fileStore,
      configStore: { baseUrl, gmSupport },
    } = this.props

    const {
      loading,
      dirPath,
      transition,
      parentDir,
      dirName,
      rename,
      readDir,
      changeDir,
      refreshDir,
      remove,
      upload,
      makeDir,
      fileUrl,
      previewUrl,
      currentFile,
    } = fileStore

    const files = toJS(fileStore.files)

    return (
      <Container fill direction="column">
        <Container transition={transition || 'none'}>
          <View key={dirPath}>
            <NavBar
              title={dirName || 'File Manager'}
              amStyle="primary"
              leftNav={
                parentDir !== null
                  ? [
                      {
                        component: Link,
                        icon: 'left-nav',
                        onClick: () => {
                          changeDir(parentDir)
                        },
                      },
                    ]
                  : null
              }
              rightNav={[
                {
                  component: Link,
                  icon: 'refresh',
                  onClick: () => {
                    refreshDir(dirPath)
                  },
                },
                {
                  component: Link,
                  icon: 'more',
                  onClick: () => {
                    fileStore.directoryActionSheetModal.open()
                  },
                },
              ]}
            />
            <Container scrollable>
              <Group header={dirPath || null} noPadded>
                {files && files.length > 0 ? (
                  <List>
                    {files.map((file, i) => {
                      let { fileName, type, size, birthtime, hidden } = file
                      let filePath
                      if (dirPath) {
                        filePath = dirPath + '/' + fileName
                      } else {
                        filePath = fileName
                      }

                      const hiddenFileStyle = hidden ? css.hiddenFile : ''

                      if (type === 'directory') {
                        return (
                          <List.Item
                            key={filePath}
                            title={fileName}
                            linkComponent={Link}
                            linkProps={{
                              className: hiddenFileStyle,
                              onClick: () => {
                                changeDir(filePath)
                              },
                            }}
                          />
                        )
                      } else if (type === 'file') {
                        let media = null
                        if (gmSupport && isSupportedImage(fileName)) {
                          const imgUrl =
                            baseUrl +
                            '/image/resize?' +
                            qs.stringify({ fileName, dirPath })
                          media = <img src={imgUrl} width="48" />
                        }
                        return (
                          <List.Item
                            key={filePath}
                            title={fileName}
                            media={media}
                            linkComponent={Link}
                            linkProps={{
                              className: [css.noNav, hiddenFileStyle].join(' '),
                              onClick: () => {
                                fileStore.currentFile = file
                                fileStore.fileActionSheetModal.open()
                              },
                            }}
                            after={<span className={css.fileSize}>{size}</span>}
                          />
                        )
                      } else {
                        return <List.Item key={filePath} title={fileName} />
                      }
                    })}
                  </List>
                ) : null}
              </Group>
            </Container>
          </View>
        </Container>
        {/* <TabBar>
        <TabBar.Item selected icon="list" />
        <TabBar.Item icon="info" badge={0} />
      </TabBar> */}
        <ActionSheetModal
          ref={el => (fileStore.directoryActionSheetModal = el)}
        >
          <List>
            <List.Item>
              <Link
                className={css.actionSheetLink}
                onClick={() => {
                  fileStore.directoryActionSheetModal.close(() => {
                    this.makeDirPromptModal.open()
                  })
                }}
              >
                New Folder
              </Link>
            </List.Item>
            <List.Item>
              <Link
                className={css.actionSheetLink}
                onClick={() => {
                  fileStore.directoryActionSheetModal.close(() => {
                    this.uploadFileModal.open()
                  })
                }}
              >
                Upload Files
              </Link>
            </List.Item>
          </List>
        </ActionSheetModal>
        <ActionSheetModal ref={el => (fileStore.fileActionSheetModal = el)}>
          <List>
            {gmSupport &&
              isSupportedImage(currentFile ? currentFile.fileName : '') && (
                <List.Item>
                  <img src={previewUrl} />
                </List.Item>
              )}
            <List.Item>
              <Link
                className={css.actionSheetLink}
                href={fileUrl}
                target="_blank"
              >
                Open
              </Link>
            </List.Item>
            <List.Item>
              <Link
                className={css.actionSheetLink}
                onClick={() => {
                  fileStore.fileActionSheetModal.close(() => {
                    this.renamePromptModal.open()
                  })
                }}
              >
                Rename
              </Link>
            </List.Item>
            <List.Item>
              <Link
                className={css.actionSheetLink}
                onClick={() => {
                  fileStore.fileActionSheetModal.close(() => {
                    this.trashConfirmModal.open()
                  })
                }}
              >
                Trash
              </Link>
            </List.Item>
            <List.Item>
              <Link
                className={css.actionSheetLink}
                onClick={() => {
                  fileStore.fileActionSheetModal.close(() => {
                    this.deleteConfirmModal.open()
                  })
                }}
              >
                Delete
              </Link>
            </List.Item>
            <List.Item>
              <Link
                className={css.actionSheetLink}
                onClick={() => {
                  fileStore.fileActionSheetModal.close(() => {
                    fileStore.download()
                  })
                }}
              >
                Download
              </Link>
            </List.Item>
          </List>
        </ActionSheetModal>
        <UploadFileModal
          ref={el => (this.uploadFileModal = el)}
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
        <ConfirmModal
          ref={el => (this.deleteConfirmModal = el)}
          onAction={ok => {
            if (ok && currentFile) {
              remove(dirPath, [currentFile.fileName], true).then(length => {
                readDir(dirPath)
              })
            }
          }}
        />
        <ConfirmModal
          ref={el => (this.trashConfirmModal = el)}
          title="Move To Trash"
          confirmText="Trash"
          onAction={ok => {
            if (ok && currentFile) {
              remove(dirPath, [currentFile.fileName], false).then(length => {
                readDir(dirPath)
              })
            }
          }}
        />
        <PromptModal
          ref={el => (this.makeDirPromptModal = el)}
          title="New Folder"
          desc="Enter the path for the new folder."
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
        <PromptModal
          ref={el => (this.renamePromptModal = el)}
          title="Rename"
          desc="Enter the name for the file."
          placeholder={currentFile && currentFile.fileName}
          onAction={newName => {
            if (newName === null) {
              this.renamePromptModal.close()
            } else if (newName) {
              rename(dirPath, newName).then(length => {
                this.renamePromptModal.close(() => {
                  length > 0 && readDir(dirPath)
                })
              })
            }
          }}
        />
        <Modal role="loading" isOpen={loading} />
      </Container>
    )
  }
}

function isSupportedImage(fileName) {
  const type = mime.getType(fileName)
  return [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
  ].some(i => i === type)
}
