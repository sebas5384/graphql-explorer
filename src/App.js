import React from 'react'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ReactCursorPosition from 'react-cursor-position'
import { withEvents } from 'react-compose-events'
import isHotKey from 'is-hotkey'

import './App.css'

import Editor from './modules/editor/containers/Editor'
import NodeEditor from './modules/editor/containers/NodeEditor'
import { addNode, resetConnector } from './modules/editor/store'

const PainelNavigator = styled.section`
  position: fixed;
  top: 2.2em;
  left: 2.3em;
  z-index: 1;
`

const App = ({ handleAddNode, handleAddEdge }) => (
  <div className='App'>
    <a className='addNode' onClick={ handleAddNode }>ADD NODE</a>
    <PainelNavigator>
      <NodeEditor />
    </PainelNavigator>
    <ReactCursorPosition mapChildProps={ ({ position }) => ({ cursorPosition: position })}>
      <Editor />
    </ReactCursorPosition>
  </div>
)

const handleAddNode = ({ dispatch }) => event => {
  const name = prompt('Whats my name?')
  name && dispatch(addNode({ name, pos: { x: 50, y: 50 }, type: 'model' }))
}

const mapStateToProps = ({ nodes }) => ({ nodes })

export default compose(
  connect(mapStateToProps),
  withHandlers({ handleAddNode }),
  withEvents(window, ({ dispatch }) => ({
    keydown: event => {
      if (isHotKey('esc')(event)) {
        dispatch(resetConnector())
      }
    }
  }))
)(App)
