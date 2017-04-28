import React from 'react'
import { Group, Line } from 'react-konva'

const ConnectorEdge = ({ points, active = false }) => {
  const color = active ? '#FF68C5' : '#9B9B9B'

  const lineDefaultProps = {
    fill: color,
    stroke: color,
    strokeWidth: 5,
    dashEnabled: true,
    dash: [8, 3]
  }

  return (
    <Group>
      <Line
        { ...lineDefaultProps }
        points={ points }
      />
    </Group>
  )
}

export default ConnectorEdge
