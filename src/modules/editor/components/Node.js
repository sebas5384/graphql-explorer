import React from 'react'

import NodeModel from './NodeModel'
import NodeRelation from './NodeRelation'

const Node = props => {
  const {
    connector: { connectedTo }, name, selected, type
  } = props
  const isConnected = (connectedTo === name) || (connectedTo && selected)

  switch (type) {
    case 'model':
      return <NodeModel { ...props } isConnected={ isConnected } />
    case 'relation':
      return <NodeRelation {...props } isConnected={ isConnected } />
    default:
  }
}

export default Node
