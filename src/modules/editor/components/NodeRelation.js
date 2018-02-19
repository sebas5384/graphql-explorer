import React from 'react'
import { Image, Group, Circle, Text } from 'react-konva'
import { compose, lifecycle, withState } from 'recompose'
import { spring, Motion } from 'react-motion'
import { connect } from 'react-redux'

import nodeImg from './assets/relation.svg'

const size = { width: 90, height: 90 }

const strokeCircleProps = {
  ...size,
  fill: 'white',
  stroke: 'white',
  strokeWidth: 5.7,
  x: 45,
  y: 45,
}

const selectedCircleProps = {
  radius: 60,
  stroke: '#0099FF',
  strokeWidth: 2,
  x: 45,
  y: 45,
  dash: [6, 4],
  dashEnabled: true
}

const TextLabel = ({ text }) => (
  <Text
    width={ 90 }
    padding={ 10 }
    x={ 0 }
    y={ 27 }
    text={ text }
    align='center'
    wrap='char'
    fontSize={ 13 }
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
  const { setImage } = this.props
  const image = new window.Image()
  image.src = nodeImg
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
