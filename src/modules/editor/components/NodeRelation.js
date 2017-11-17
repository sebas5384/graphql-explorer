import React from 'react'
import { Image, Group, Circle, Text } from 'react-konva'
import { compose, lifecycle, withState } from 'recompose'
import { spring, Motion } from 'react-motion'

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

const ConnectingCircle = ({ active = false }) => (
  <Motion
    defaultStyle={{ rotation: 0 }}
    style={{ rotation: spring(-10, { stiffness: 60, damping: 0 }) }}
  >
    { ({ rotation }) => (
      <Circle
        { ...selectedCircleProps }
        rotation={ rotation }
        stroke={ active ? '#FF68C5' : '#0099FF' }
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
  ...props
}) => {
  return (
    <Group { ...props }>
      <Circle { ...strokeCircleProps } />
      { (!isConnecting && selected) &&
        <Circle { ...selectedCircleProps } />
      }
      { ((isConnecting && selected) || isConnected) &&
        <ConnectingCircle active={ isConnected } />
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

export default compose(
  withState('image', 'setImage', null),
  lifecycle({ componentWillMount })
)(Node)
