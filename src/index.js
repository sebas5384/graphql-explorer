import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'recompose'
import AppContainer from './App'
import './index.css'

import createStore from './createStore'
import withStore from './withStore'

const renderApp = store => {
  const App = compose(
    withStore(store)
  )(AppContainer)

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  )
}

createStore()
  .then(({ store }) => renderApp(store))
