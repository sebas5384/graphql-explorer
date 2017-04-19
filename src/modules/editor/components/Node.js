import React from 'react'
import { Image, Group, Circle, Text } from 'react-konva'
import { compose, lifecycle, withState } from 'recompose'

import nodeImg from './assets/node.svg'

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

const Node = ({ draggable, dragBoundFunc, selected, image, onClick, name, setImage, ...props }) => {
  return (
    <Group { ...props }>
      <Circle { ...strokeCircleProps } />
      { selected &&
        <Circle ref='selectedCircle' { ...selectedCircleProps } />
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
