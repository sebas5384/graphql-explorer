import React from 'react'
import { Group, Line, Arc } from 'react-konva'

const calculateRotation = diffs => (Math.atan2(...diffs) * -1) * 180 / Math.PI

// Positions must be [[x1, x2], [y1, y2]].
const rotationFromPositions = positions => {
  const diffs = positions.map(([posA, posB]) => posA - posB)
  const rotation = calculateRotation(diffs)

  // @TODO find a way to not need this tweek.
  const adjustAngle = value => value - 95

  return adjustAngle(rotation)
}

const hasOneRadiusByType = type =>  {
  switch (type) {
    case 'model':
      return { innerRadius: 65, outerRadius: 68 }
    case 'relation':
      return { innerRadius: 48, outerRadius: 51 }
    default:
  }
}

const hasManyRadiusByType = type =>  {
  switch (type) {
    case 'model':
      return { innerRadius: 70, outerRadius: 73 }
    case 'relation':
      return { innerRadius: 53, outerRadius: 56 }
    default:
  }
}

const Edge = ({ points, name, type, active = true, connectedTo }) => {
  const [posAX, posAY, posBX, posBY] = points
  const rotationB = rotationFromPositions([[posBX, posAX], [posBY, posAY]])

  const color = active ? '#FF68C5' : '#9B9B9B'

  const lineDefaultProps = {
    fill: color,
    stroke: color,
    strokeWidth: 4,
    // dashEnabled: true,
    // dash: [8, 3]
  }
  
  const hasOneRadius = hasOneRadiusByType(connectedTo.type)
  const arcHasOneProps = {
    ...hasOneRadius,
    fill: color,
    angle: 11,
  }
  
  const hasManyRadius = hasManyRadiusByType(connectedTo.type)
  const arcManyProps = {
    ...hasManyRadius,
    fill: color,
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
        points={ points }
      />
    </Group>
  )
}

export default Edge
