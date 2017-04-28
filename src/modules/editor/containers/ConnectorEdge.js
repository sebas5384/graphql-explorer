import { compose, mapProps } from 'recompose'
import { connect } from 'react-redux'

import ConnectorEdge from '../components/ConnectorEdge'
import {
  getSelectedNode,
  getConnectedNode,
  normalizePosWithStage
} from '../store'

const mapStateToProps = ({ nodes, stage, connector: { connectedTo } }) => ({
  stage,
  node: getSelectedNode(nodes),
  active: connectedTo !== null,
  connectedNode: getConnectedNode({ nodes, connectedTo })
})

const centralizeLinePoints = ({ x, y }) => ({ x: x + 61, y: y + 61 })

const connectWithPoints = ({
  node: { pos },
  stage,
  cursorPosition,
  active,
  connectedNode
}) => {
  const { x: posAX, y: posAY } = centralizeLinePoints(pos)

  const destinationPosition = active
    ? centralizeLinePoints(connectedNode.pos)
    : normalizePosWithStage({ stage, pos: cursorPosition })

  const { x: posBX, y: posBY } = destinationPosition

  return { points: [posAX, posAY, posBX, posBY], active }
}

const ConnectorEdgeContainer = compose(
  connect(mapStateToProps),
  mapProps(connectWithPoints)
)(ConnectorEdge)

export default ConnectorEdgeContainer
