import React from 'react'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ReactCursorPosition from 'react-cursor-position'
import { withEvents } from 'react-compose-events'
import isHotKey from 'is-hotkey'

import SidebarContainer from './modules/sidebar/containers/SidebarContainer'
import Editor from './modules/editor/containers/Editor'
import NodeEditor from './modules/editor/containers/NodeEditor'
import {
  addNode, resetConnector, resetSelectedNode,
  normalizePosWithStage, resetContextualDelete, deleteTargetedNodes
} from './modules/editor/store'
import { normalizeNodeName } from './modules/editor/lib/helpers'
import { resetSidebar } from './modules/sidebar/store'

const PainelNavigator = styled.section`
  position: fixed;
  top: 2.2em;
  left: 2.3em;
  z-index: 1;
`
const NodeAdd = styled.a`
  background: url('/add-node.png') no-repeat;
  width: 115px;
  height: 116px;
  display: block;
  cursor: pointer;
  text-indent: -999px;
  overflow: hidden;
  position: fixed;
  bottom: 10px;
  right: 30px;
  z-index: 1;
`

const NodeDelete = styled.a`
  background: url('/delete-node.png') no-repeat;
  width: 115px;
  height: 116px;
  display: block;
  cursor: pointer;
  text-indent: -999px;
  overflow: hidden;
  position: fixed;
  bottom: 18px;
  right: 30px;
  z-index: 1;
`

const DownloadImage = styled.a`
  background: url('/add-node.png') no-repeat;
  width: 115px;
  height: 116px;
  display: block;
  cursor: pointer;
  text-indent: -999px;
  overflow: hidden;
  position: fixed;
  bottom: 10px;
  right: 150px;
  z-index: 1;
`

const App = ({ handleAddNode, handleDownloadImage, handleAddEdge, showAdd, showDelete, handleDeleteNode }) => (
  <div className='App'>
    <DownloadImage onClick={ handleDownloadImage }>DOWNLOAD IMAGE</DownloadImage>
    { showAdd && <NodeAdd onClick={ handleAddNode }>ADD NODE</NodeAdd> }
    { showDelete && <NodeDelete onClick={ handleDeleteNode }>DELETE NODE</NodeDelete> }
    <PainelNavigator>
      <NodeEditor />
    </PainelNavigator>
    <SidebarContainer />
    <ReactCursorPosition mapChildProps={ ({ position }) => ({ cursorPosition: position })}>
      <Editor />
    </ReactCursorPosition>
  </div>
)

const handleAddNode = ({ dispatch, stage }) => event => {
  const name = prompt("What's the name of this new Type?")
  if (!name || name.length < 1) return
  const pos = normalizePosWithStage({ stage, pos: { x: 150, y: 150 } })
  const newNode = normalizeNodeName({ name, pos, type: 'model' })
  dispatch(addNode(newNode))
}

const handleDeleteNode = ({ dispatch, stage }) => event => {
  dispatch(deleteTargetedNodes())
}

const handleDownloadImage = ({ dispatch, stage }) => event => {
  // dispatch(downloadImage(stage))
  const dataURL = stage.toDataURL({ pixelRatio: 3 })
  const link = document.createElement('a')
  link.download = 'stage.png'
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const mapStateToProps = ({ nodes, stage, contextualDelete }) => ({
  nodes,
  stage,
  showAdd: contextualDelete.targets.length === 0,
  showDelete: contextualDelete.targets.length > 0,
})

export default compose(
  connect(mapStateToProps),
  withHandlers({ handleAddNode, handleDeleteNode, handleDownloadImage }),
  withEvents(window, ({ dispatch }) => ({
    keydown: event => {
      if (isHotKey('esc')(event)) {
        dispatch(resetConnector())
        dispatch(resetSelectedNode())
        dispatch(resetContextualDelete())
        dispatch(resetSidebar())
      }
    }
  }))
)(App)
