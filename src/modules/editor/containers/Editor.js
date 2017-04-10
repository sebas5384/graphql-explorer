import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Layer, Stage } from 'react-konva'
import windowDimensions from 'react-window-dimensions'
import Node from '../components/Node'
import Edge from '../components/Edge'

import { updateNode, selectNode } from '../store'

const handleDrag = ({ name, dispatch }) => function (pos) {
  dispatch(updateNode({ name, pos }))
  return pos
}

const handleClick = ({ name, dispatch }) => event => {
  dispatch(selectNode({ name }))
}

const Editor = ({ width, height, nodes, edges, dispatch }) => {
  const style = {
    position: 'fixed'
  }

  return (
    <Stage style={ style } width={ width } height={ height }>
      <Layer>
        { edges.map(({ name, points, type }) => (
          <Edge key={ name } type={ type } name={ name } points={ points } />
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

const mapStateToProps = ({ nodes, edges }) => ({ edges, nodes })

export default compose(
  connect(mapStateToProps),
  windowDimensions()
)(Editor)
