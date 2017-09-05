import React, { Component } from 'react'
import { Link } from 'react-router'
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

  static getPreloadedState = async (path, state, {
    url: dirPath,
    urlPrefix,
    headers,
  }) => {
    const files = await fileService.readDir(urlPrefix + dirPath, headers)
    return {
      ...state,
      fileStore: {
        dirPath,
        files,
      }
    }
  }

  oldPathname = null

  componentWillUpdate (nextProps, nextState) {
    const {
      action,
      pathname,
    } = nextProps.location

    if (pathname !== this.oldPathname) {
      const {
        fileStore: {
          readDir,
        },
        configStore: {
          baseUrl,
          restUrl,
        },
      } = this.props

      const path = pathname.substr(baseUrl.length)
      this.oldPathname = pathname
      readDir(restUrl, path)
    }
  }

  render () {
    const {
      fileStore: {
        loading,
        dirPath,
        files,
      },
    } = this.props

    return <Container fill direction='column'>
      <Container transition='rfr'>
        <View>
          <NavBar title='Explorer' amStyle='primary' />
          <Container scrollable>
            <Group header={dirPath} noPadded>
              {
                files && files.length > 0 ? <List>
                  {
                    files.map(({
                      filename,
                      type,
                      size,
                    }, i) => {
                      let filePath
                      if (dirPath === '/') {
                        filePath = dirPath + filename
                      } else {
                        filePath = dirPath + '/' + filename
                      }
                      return <List.Item key={filePath}
                        title={filename}
                        linkComponent={type === 'directory' ? Link : null}
                        linkProps={{
                          to: filePath,
                        }}
                      />
                    })
                  }
                </List> : null
              }
              <Modal role='loading' isOpen={loading}></Modal>
            </Group>
          </Container>
        </View>
      </Container>
      <TabBar>
        <TabBar.Item selected icon="home" />
        <TabBar.Item icon="info" badge={1} />
      </TabBar>
    </Container>
  }
}
