import React from 'react'
import { Provider } from 'react-redux'

const withStore = store => Component => props => (
  <Provider store={ store }>
    <Component { ...props } />
  </Provider>
)
export default withStore
