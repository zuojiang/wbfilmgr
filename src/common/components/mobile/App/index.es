import React, { Component } from 'react'
import { Link } from 'react-router'
import qs from 'qs'
import {
  observable,
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
} from 'amazeui-touch'

import css from './style.css'
import {
  fileService,
} from '~/common/services/'

@inject('configStore', 'fileStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  transition = 'sfr'

  static getPreloadedState = async (path, state, {
    query: {
      dirPath,
    },
    urlPrefix,
    headers,
  }) => {
    const files = await fileService.readDir(urlPrefix + '/list?' + qs.stringify({
      dirPath,
    }), {
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
      fileStore: {
        loading,
        dirPath,
        transition,
        files,
        parentDir,
        dirName,
        changeDir,
      },
      configStore: {
        baseUrl,
      },
    } = this.props

    return <Container fill direction='column'>
      <Container transition={transition || 'none'}>
        <View key={dirPath}>
          <NavBar title={dirName || 'File Explorer'} amStyle='primary' leftNav={parentDir !== null ? [{
            component: Link,
            icon: 'left-nav',
            title: 'Back',
            onClick: () => {
              changeDir(parentDir)
            },
          }] : null}/>
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
          <Modal role='loading' isOpen={loading} />
        </View>
      </Container>
      <TabBar>
        <TabBar.Item selected icon="list" />
        <TabBar.Item icon="info" badge={0} />
      </TabBar>
    </Container>
  }
}
