import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Layer, Stage } from 'react-konva'
import windowDimensions from 'react-window-dimensions'

import Node from '../components/Node'
import Edge from '../components/Edge'
import ConnectorEdge from '../containers/ConnectorEdge'

import {
  updateStage,
  updateNode,
  selectNode,
  getSelectedNode,
  updateConnector
} from '../store'

const handleDragStage = dispatch => function (pos) {
  dispatch(updateStage({ pos }))
  return pos
}

const handleDrag = ({ name, dispatch }) => function (pos) {
  dispatch(updateNode({ name, pos }))
  return pos
}

const handleClick = ({ name, dispatch }) => event => {
  dispatch(selectNode({ name }))
}

const handleDoubleClick = ({ name, dispatch }) => event => {
  dispatch(updateConnector({ isConnecting: true }))
}

const handleMouseOver = ({ name, selectedNode, connector: { isConnecting }, dispatch }) => event => {
  if (isConnecting && selectedNode.name !== name) {
    dispatch(updateConnector({ connectedTo: name }))
  }
}

const handleMouseOut = ({ name, connector: { isConnecting, connectedTo }, dispatch }) => event => {
  if (isConnecting && name === connectedTo) {
    dispatch(updateConnector({ connectedTo: null }))
  }
}

const edgeIsActive = ({ edgeNodes, selectedNode = {} }) => edgeNodes
  .some(nodeName => (
    !selectedNode.hasOwnProperty('name') || nodeName === selectedNode.name
  ))

const Editor = ({
  width, height, nodes, edges, selectedNode, dispatch, cursorPosition, connector
}) => {
  const style = {
    position: 'fixed'
  }

  return (
    <Stage draggable dragBoundFunc={ handleDragStage(dispatch) } style={ style } width={ width } height={ height }>
      <Layer>
        { edges.map(({ name, points, type, nodes: edgeNodes }) => (
          <Edge
            key={ name }
            active={ edgeIsActive({ edgeNodes, selectedNode }) }
            type={ type }
            name={ name }
            points={ points }
          />
        ))}

        { connector.isConnecting &&
          <ConnectorEdge cursorPosition={ cursorPosition } />
        }

        { nodes.map(({ name, pos, selected }) => (
          <Node
            key={ name }
            name={ name }
            selected={ selected }
            connector={ connector }
            draggable dragBoundFunc={ handleDrag({ name, dispatch }) }
            onClick={ handleClick({ name, dispatch }) }
            onDblclick={ handleDoubleClick({ name, dispatch }) }
            onMouseOver={ handleMouseOver({ name, selectedNode, connector, dispatch }) }
            onMouseOut={ handleMouseOut({ name, connector, dispatch }) }
            x={ pos.x }
            y={ pos.y }
          />
        )) }
      </Layer>
    </Stage>
  )
}

const mapStateToProps = ({ nodes, edges, connector }) => ({
  edges,
  nodes,
  selectedNode: getSelectedNode(nodes),
  connector,
})

export default compose(
  connect(mapStateToProps),
  windowDimensions()
  // @TODO use withHandlers.
)(Editor)
