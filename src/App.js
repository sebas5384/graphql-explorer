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
  name && dispatch(addNode({ name, pos: { x: 50, y: 50 } }))
}

const handleAddEdge = ({ dispatch, nodes }) => event => {
  const selectedNode = nodes.find(node => node.selected)
  const defaultName = selectedNode ? selectedNode.name + 'HasMany' : ''
  const name = prompt('Name of the relation?', defaultName)
  name && dispatch(addEdge({ name }))
}

const mapStateToProps = ({ nodes }) => ({ nodes })

export default compose(
  connect(mapStateToProps),
  withHandlers({ handleAddNode, handleAddEdge })
)(App)
