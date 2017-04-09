import React from 'react'
import { Image, Group } from 'react-konva'
import { compose, lifecycle, withState } from 'recompose'

import nodeImg from './assets/node.svg'

const Node = ({ image, ...props }) => {
  return (
    <Group { ...props }>
      <Image width='124' height='124' image={ image } />
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
