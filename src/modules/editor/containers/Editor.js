import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Layer, Stage, Line } from 'react-konva'
import windowDimensions from 'react-window-dimensions'
import Node from '../components/Node'

import { updateNode } from '../store'

const handleDrag = ({ name, dispatch }) => function (pos) {
  dispatch(updateNode({ name, pos }))

  return pos
}

const Editor = ({ width, height, nodes, edges, dispatch }) => {
  const style = {
    position: 'fixed'
  }

  const centralizeLinePoints = points => points.map(pos => pos + 62)
  const lineDefaultProps = {
    fill: 'black',
    stroke: 'black',
    strokeWidth: 4,
    tension : 0.6
  }

  return (
    <Stage style={ style } width={ width } height={ height }>
      <Layer>
        { edges.map(({ name, points }) => (
          <Line
            key={ name }
            { ...lineDefaultProps }
            points={ centralizeLinePoints(points) }
          />
        ))}
        { nodes.map(({ name, pos }) => (
            <Node
              key={ name }
              draggable dragBoundFunc={ handleDrag({ name, dispatch }) }
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
