import React from 'react'
import { Image, Group, Circle, Text } from 'react-konva'
import { compose, lifecycle, withState } from 'recompose'

import nodeImg from './assets/node.svg'

const size = { width: 124, height: 124 }

const strokeCircleProps = {
  ...size,
  fill: 'white',
  stroke: 'white',
  strokeWidth: 6,
  x: 61,
  y: 61,
}

const selectedCircleProps = {
  radius: 85,
  stroke: '#0099FF',
  strokeWidth: 2,
  x: 61,
  y: 61,
  dash: [6, 4],
  dashEnabled: true
}

const TextLabel = ({ name }) => (
  <Text
    width={ 100 }
    height={ 119 }
    x={ 11 }
    y={ 49 }
    text={ name }
    align='center'
    wrap='char'
    fontSize={ 20 }
    fill='#666666'
  />
)

const Node = ({ selected, image, onClick, name, ...props }) => {
  return (
    <Group { ...props }>
      <Circle { ...strokeCircleProps } />
      { selected &&
        <Circle ref='selectedCircle' { ...selectedCircleProps } />
      }
      <Image { ...size } image={ image } onClick={ onClick } />
      <TextLabel name={ name } />
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
