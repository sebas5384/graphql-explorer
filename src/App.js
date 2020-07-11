import React from 'react'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'
import isHotKey from 'is-hotkey'
import { useMouse, useKey } from 'react-use';

import SidebarContainer from './modules/sidebar/containers/SidebarContainer'
import Editor from './modules/editor/containers/Editor'
import {
  addNode, resetConnector, resetSelectedNode,
  normalizePosWithStage, resetContextualDelete, deleteTargetedNodes
} from './modules/editor/store'
import { normalizeNodeName } from './modules/editor/lib/helpers'
import { resetSidebar } from './modules/sidebar/store'

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

function useResetKey(dispatch) {
  useKey(isHotKey('esc'), () => {
    dispatch(resetConnector())
    dispatch(resetSelectedNode())
    dispatch(resetContextualDelete())
    dispatch(resetSidebar())
  })
}

const App = ({ handleAddNode, showAdd, showDelete, handleDeleteNode, dispatch }) => {
  let ref = React.useRef(null)
  const {elX, elY} = useMouse(ref)
  const cursorPosition = { x: elX, y: elY }

  useResetKey(dispatch)

  return (
    <div className='App'>
      { showAdd && <NodeAdd onClick={ handleAddNode }>ADD NODE</NodeAdd> }
      { showDelete && <NodeDelete onClick={ handleDeleteNode }>DELETE NODE</NodeDelete> }
      <SidebarContainer />
      <div ref={ref}>
        <Editor cursorPosition={cursorPosition} />
      </div>
    </div>
  )
}

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

const mapStateToProps = ({ nodes, stage, contextualDelete }) => ({
  nodes,
  stage,
  showAdd: contextualDelete.targets.length === 0,
  showDelete: contextualDelete.targets.length > 0,
})

export default compose(
  connect(mapStateToProps),
  withHandlers({ handleAddNode, handleDeleteNode }),
)(App)
