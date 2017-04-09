import React, { Component } from 'react'
import './App.css'

import Editor from './modules/editor/containers/Editor'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Editor />
      </div>
    )
  }
}

export default App
