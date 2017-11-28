import { compose, mapProps } from 'recompose'
import { connect } from 'react-redux'

import ConnectorEdge from '../components/ConnectorEdge'
import {
  getSelectedNode,
  getConnectedNode,
  normalizePosWithStage,
  centralizePositions
} from '../store'

const mapStateToProps = ({ nodes, stage, connector: { connectedTo } }) => ({
  stage,
  node: getSelectedNode(nodes),
  active: connectedTo !== null,
  connectedNode: getConnectedNode({ nodes, connectedTo })
})

const connectWithPoints = ({
  node,
  stage,
  cursorPosition,
  active,
  connectedNode
}) => {
  const { x: posAX, y: posAY } = centralizePositions(node)

  const destinationPosition = active
    ? centralizePositions(connectedNode)
    : normalizePosWithStage({ stage, pos: cursorPosition })

  const { x: posBX, y: posBY } = destinationPosition
  return { points: [posAX, posAY, posBX, posBY], active }
}

const ConnectorEdgeContainer = compose(
  connect(mapStateToProps),
  mapProps(connectWithPoints)
)(ConnectorEdge)

export default ConnectorEdgeContainer
