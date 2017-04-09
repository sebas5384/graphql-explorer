import React from 'react'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import './App.css'

import Editor from './modules/editor/containers/Editor'
import { addNode, addEdge } from './modules/editor/store'


const App = ({ handleAddNode,handleAddEdge }) => (
  <div className="App">
    <button onClick={ handleAddNode }>+1 NODE</button>
    <button onClick={ handleAddEdge }>+1 RELATION</button>
    <Editor />
  </div>
)

const handleAddNode = ({ dispatch }) => event => {
  const name = prompt('Whats my name?')
  dispatch(addNode({ name, pos: { x: 50, y: 50 } }))
}

const handleAddEdge = ({ dispatch }) => event => {
  const name = prompt('Name of the relation?', 'PostHasManyComment')
  dispatch(addEdge({ name }))
}

export default compose(
  connect(),
  withHandlers({ handleAddNode, handleAddEdge })
)(App)
