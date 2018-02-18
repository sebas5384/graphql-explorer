import React from 'react'
import { Image } from 'react-konva'
import { compose, withState, lifecycle, withHandlers } from 'recompose'

import activeDeleteImg from './assets/contextual-delete-active.svg'
import defaultDeleteImg from './assets/contextual-delete.svg'

const imgSize = { width: 64, height: 49 }

const ContextualDelete = ({ pos, image, handleOnClick, handleOnMouseLeave }) => {
  return (
    <Image
      { ...imgSize }
      x={ pos.x } y={ pos.y }
      onClick={ handleOnClick }
      onMouseLeave={ handleOnMouseLeave }
      image={ image }
    />
  )
}

function componentWillMount() {
  const { setImage, type } = this.props

  const defaultImage = new window.Image()
  defaultImage.src = defaultDeleteImg
  defaultImage.onload = () => setImage(defaultImage)

  const activeImage = new window.Image()
  activeImage.src = activeDeleteImg
  activeImage.onload = () => {
    setTimeout(() => setImage(activeImage), 200)
  }
}

export default compose(
  withState('image', 'setImage', null),
  lifecycle({ componentWillMount })
)(ContextualDelete)