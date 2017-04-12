import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Layer, Stage } from 'react-konva'
import windowDimensions from 'react-window-dimensions'
import Node from '../components/Node'
import Edge from '../components/Edge'

import { updateStage, updateNode, selectNode, getSelectedNode } from '../store'

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

const edgeIsActive = ({ edgeNodes, selectedNode = {} }) => edgeNodes
  .some(nodeName => (!selectedNode.hasOwnProperty('name') || nodeName === selectedNode.name))

const Editor = ({ width, height, nodes, edges, selectedNode, dispatch }) => {
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
        { nodes.map(({ name, pos, selected }) => (
          <Node
            key={ name }
            name={ name }
            selected={ selected }
            draggable dragBoundFunc={ handleDrag({ name, dispatch }) }
            onClick={ handleClick({ name, dispatch }) }
            x={ pos.x }
            y={ pos.y }
          />
        )) }
      </Layer>
    </Stage>
  )
}

const mapStateToProps = ({ nodes, edges }) => ({
  edges,
  nodes,
  selectedNode: getSelectedNode(nodes),
})

export default compose(
  connect(mapStateToProps),
  windowDimensions()
)(Editor)
