import React from 'react'
import { ReactReduxContext, Provider } from 'react-redux'
import { Stage } from 'react-konva'

const StageWithRedux = ({ children, ...props }) => (
  <ReactReduxContext.Consumer>
    {({ store }) => (
      <Stage {...props}>
        <Provider store={store}>{children}</Provider>
      </Stage>
    )}
  </ReactReduxContext.Consumer>
)

export default StageWithRedux
