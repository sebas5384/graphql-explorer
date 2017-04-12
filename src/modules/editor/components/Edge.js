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

const Edge = ({ points, name, type, active = true }) => {
  const centralizedPoints = centralizeLinePoints(points)
  const [posAX, posAY, posBX, posBY] = centralizedPoints
  // const rotationA = rotationFromPositions([[posAX, posBX], [posAY, posBY]])
  const rotationB = rotationFromPositions([[posBX, posAX], [posBY, posAY]])

  const color = active ? '#FF68C5' : '#9B9B9B'

  const lineDefaultProps = {
    fill: color,
    stroke: color,
    strokeWidth: 4,
    // dashEnabled: true,
    // dash: [8, 3]
  }

  const arcHasOneProps = {
    fill: color,
    innerRadius: 65,
    outerRadius: 68,
    angle: 11,
  }

  const arcManyProps = {
    fill: color,
    innerRadius: 72,
    outerRadius: 75,
    angle: 10,
  }

  return (
    <Group>
      {/* <Arc { ...arcManyProps } x={ posAX } y={ posAY } rotation={ rotationA } /> */}
      <Arc { ...arcHasOneProps } x={ posBX } y={ posBY } rotation={ rotationB }/>
      { /many/i.test(type) &&
        <Arc { ...arcManyProps } x={ posBX } y={ posBY } rotation={ rotationB }/>
      }
      <Line
        { ...lineDefaultProps }
        points={ centralizedPoints }
      />
    </Group>
  )
}

export default Edge
