import React from 'react'
import { Image, Group, Circle, Text } from 'react-konva'
import { compose, lifecycle, withState } from 'recompose'
import { spring, Motion } from 'react-motion'
import { connect } from 'react-redux'

import nodeImg from './assets/node.svg'
import nodeRelationImg from './assets/relation.svg'

const size = { width: 124, height: 124 }

const strokeCircleProps = {
  ...size,
  fill: 'white',
  stroke: 'white',
  strokeWidth: 5.7,
  x: 61,
  y: 61,
}

const selectedCircleProps = {
  radius: 83,
  stroke: '#0099FF',
  strokeWidth: 2,
  x: 61,
  y: 61,
  dash: [6, 4],
  dashEnabled: true
}

const TextLabel = ({ text }) => (
  <Text
    width={ 97 }
    height={ 38 }
    x={ 12 }
    y={ 51 }
    text={ text }
    align='center'
    wrap='char'
    fontSize={ 18 }
    fontFamily='Arial'
    fill='#666666'
  />
)

const strokeColor = ({ active, deleting }) => {
  if (deleting) return '#FF0000'
  if (active) return '#FF68C5'
  return '#0099FF'
}

const AnimatedCircle = ({ active = false, deleting = false }) => (
  <Motion
    defaultStyle={{ rotation: 0 }}
    style={{ rotation: spring(-10, { stiffness: 60, damping: 0 }) }}
  >
    { ({ rotation }) => (
      <Circle
        { ...selectedCircleProps }
        rotation={ rotation }
        stroke={ strokeColor({ active, deleting }) }
      />
    ) }
  </Motion>
)

const Node = ({
  draggable,
  dragBoundFunc,
  selected,
  image,
  onClick,
  name,
  setImage,
  connector: { isConnecting, connectedTo },
  isConnected,
  isDeleting,
  ...props
}) => {
  return (
    <Group { ...props }>
      <Circle { ...strokeCircleProps } />
      { (!isConnecting && selected && !isDeleting) &&
        <Circle { ...selectedCircleProps } />
      }
      { ((isConnecting && selected) || isConnected || isDeleting) &&
        <AnimatedCircle active={ isConnected } deleting={ isDeleting} />
      }
      <Group
        x={ 0 } y={ 0 }
        onClick={ onClick }
        draggable={ draggable } dragBoundFunc={ dragBoundFunc }
        dragDistance={ 3 }
      >
        <Image { ...size } image={ image } />
        <TextLabel text={ name } />
      </Group>
    </Group>
  )
}

function componentWillMount () {
  const { setImage, type } = this.props
  const image = new window.Image()
  image.src = type === 'relation'
    ? nodeRelationImg
    : nodeImg
  image.onload = () => setImage(image)
}

const mapStateToProps = ({ contextualDelete: { targets, isActive } }, { name }) => ({
  isDeleting: targets.some(targetName => targetName === name)
})

export default compose(
  connect(mapStateToProps),
  withState('image', 'setImage', null),
  lifecycle({ componentWillMount })
)(Node)
