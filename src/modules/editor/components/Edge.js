import React from 'react'
import { Group, Line, Arc } from 'react-konva'

const centralizeLinePoints = points => points.map(pos => pos + 61)
const calculateRotation = diffs => (Math.atan2(...diffs) * -1) * 180 / Math.PI

// Positions must be [[x1, x2], [y1, y2]].
const rotationFromPositions = positions => {
  const diffs = positions.map(([posA, posB]) => posA - posB)
  const rotation = calculateRotation(diffs)

  // @TODO find a way to not need this tweek.
  const adjustAngle = value => value - 95

  return adjustAngle(rotation)
}

const lineDefaultProps = {
  fill: '#FF68C5',
  stroke: '#FF68C5',
  strokeWidth: 4,
}

const arcDefaultProps = {
  fill: '#FF68C5',
  innerRadius: 65,
  outerRadius: 68,
  angle: 11,
}

const Edge = ({ points, name, type }) => {
  const centralizedPoints = centralizeLinePoints(points)
  const [posAX, posAY, posBX, posBY] = centralizedPoints
  const rotationA = rotationFromPositions([[posAX, posBX], [posAY, posBY]])
  const rotationB = rotationFromPositions([[posBX, posAX], [posBY, posAY]])

  return (
    <Group>
      <Arc { ...arcDefaultProps } x={ posAX } y={ posAY } rotation={ rotationA } />
      <Arc { ...arcDefaultProps } x={ posBX } y={ posBY } rotation={ rotationB }/>
      <Line
        key={ name + 'line' }
        { ...lineDefaultProps }
        points={ centralizedPoints }
      />
    </Group>
  )
}

export default Edge
