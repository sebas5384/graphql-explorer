import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'
import { Layer } from 'react-konva'
import { useWindowSize } from 'react-use'

import Stage from '../../core/containers/StageWithRedux'
import Node from '../components/Node'
import Edge from '../components/Edge'
import ContextualDelete from '../containers/ContextualDelete'
import ConnectorEdge from '../containers/ConnectorEdge'

import {
  updateStage,
  updateNode,
  selectNode,
  getSelectedNode,
  getConnectedNode,
  updateConnector,
  resetConnector,
  normalizePosWithStage,
  addRelation,
  updateContextualDelete,
  resetContextualDelete
} from '../store'

const isRightClick = ({ button = 0 }) => button === 2
const isLeftClick = ({ button = 0 }) => button === 0

// @TODO Convert all these handlers to use withHandlers.
const handleDragStage = ({ dispatch, stage }) => function (pos, event) {
  if (event && isRightClick(event)) return stage.pos
  dispatch(updateStage({ pos }))
  return pos
}

const handleOnNodeDrag = ({ dispatch, stage }) => ({ name }) => function (pos) {
  const normalizedPos = normalizePosWithStage({ stage, pos })
  dispatch(updateNode({ name, pos: normalizedPos }))
  return pos
}

const handleOnDoubleClick = ({ selectedNode, dispatch }) => ({ name }) => event => {
  // Only Model nodes can create connection.
  if (selectedNode.type !== 'model') return
  dispatch(updateConnector({ isConnecting: true }))
}

const handleMouseOver = ({ name, selectedNode, connector: { isConnecting }, dispatch }) => event => {
  if (isConnecting) {
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

const preventContextmenuEvent = ({ evt }) => evt.preventDefault()

const Editor = ({
  stage, nodes, edges, selectedNode, dispatch, cursorPosition, connector,
  onNodeClick: handleOnNodeClick, onStageClick: handleOnStageClick, handleOnStageContextmenu,
  handleOnNodeDrag, handleOnDoubleClick,
  ...rest
}) => {
  const { width, height } = useWindowSize();
  const style = {
    position: 'fixed'
  }

  return (
    <Stage
      draggable
      dragDistance={ 2 }
      dragBoundFunc={ handleDragStage({ dispatch, stage }) }
      onClick={ handleOnStageClick }
      style={ style }
      width={ width }
      height={ height }
      onContentContextmenu={ preventContextmenuEvent }
    >
      <Layer>
        { edges.map(({ points, type, nodes: edgeNodes, connectedTo }) => (
          <Edge
            key={ edgeNodes.join(':') }
            active={ edgeIsActive({ edgeNodes, selectedNode }) }
            type={ type }
            points={ points }
            connectedTo={ connectedTo }
          />
        ))}

        { connector.isConnecting &&
          <ConnectorEdge cursorPosition={ cursorPosition } />
        }

        { nodes.map(({ name, pos, selected, type }) => (
          <Node
            key={ name + type }
            name={ name }
            type={ type }
            selected={ selected }
            connector={ connector }
            draggable dragBoundFunc={ handleOnNodeDrag({ name }) }
            onClick={ handleOnNodeClick({ name }) }
            onDblclick={ handleOnDoubleClick({ name }) }
            onMouseOver={ handleMouseOver({ name, selectedNode, connector, dispatch }) }
            onMouseOut={ handleMouseOut({ name, connector, dispatch }) }
            x={ pos.x }
            y={ pos.y }
          />
        )) }

        <ContextualDelete />
      </Layer>
    </Stage>
  )
}

const onNodeClick = ({ dispatch, stage, edges, selectedNode, connector, nodes }) => ({ name }) => event => {
  // Connecting Nodes.
  const { isConnecting, connectedTo } = connector
  if (isConnecting && connectedTo) {

    const connectedToNode = getConnectedNode({ nodes, connectedTo })

    // Connection from: Model to Model node.
    if ([selectedNode, connectedToNode].every(({ type }) => type === 'model')) {
      const name = prompt("What's the name of the Field?")
      const type = prompt("Type of the relation?\n(hasMany, hasOne)")
 
      if (name && type) {
        dispatch(
          addRelation({ name, nodeA: selectedNode.name, nodeB: connectedTo, type })
        )
      }
    }

    // Connection from: Model to Relation node.
    if (selectedNode.type === 'model' && connectedToNode.type === 'relation') {
      dispatch(
        addRelation({
          name,
          nodeA: selectedNode.name,
          nodeB: connectedTo,
          type: connectedToNode.cardinality,
          isModelToRelation: true
        })
      )
    }

    return dispatch(resetConnector())
  }

  // Selecting a Node.
  dispatch(selectNode({ name }))

  // Reset contextual delete menu when selecting a node.
  if (isLeftClick(event.evt)) {
    dispatch(resetContextualDelete())
  }
  // Contextual menu (right click) of Node.
  if (isRightClick(event.evt)) {
    dispatch(updateContextualDelete({
      isActive: true,
      pos: normalizePosWithStage({
        stage, pos: { x: event.evt.x - 10, y: event.evt.y - 10 }
      })
    }))
  }
}

const onStageClick = ({
  dispatch, connector: { isConnecting, connectedTo }
}) => event => (isConnecting && !connectedTo) && dispatch(resetConnector())

const edgesWithDestinationNode = ({ nodes, edges }) => edges.map(edge => ({
  ...edge, connectedTo: nodes.find(({ name }) => edge.nodes[1] === name)
}))

const mapStateToProps = ({ stage, nodes, edges, connector, contextualDelete }) => ({
  stage,
  edges: edgesWithDestinationNode({ edges, nodes }),
  nodes,
  selectedNode: getSelectedNode(nodes),
  connector
})

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onNodeClick,
    onStageClick,
    handleOnNodeDrag,
    handleOnDoubleClick,
  }),
)(Editor)
