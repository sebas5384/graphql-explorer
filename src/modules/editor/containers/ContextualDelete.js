import ContextualDelete from '../components/ContextualDelete'
import { compose, withHandlers, branch, renderNothing, lifecycle } from 'recompose'
import { connect } from 'react-redux'

import {
  updateContextualDelete,
  getSelectedNode,
  markNodeReadyToDelete
} from '../store'

const mapStateToProps = ({ contextualDelete, nodes }) => {
  return {
    ...contextualDelete,
    selectedNode: getSelectedNode(nodes)
  }
}

const handleOnMouseLeave = ({ isActive, dispatch, selectedNode }) => event => {
  dispatch(updateContextualDelete({ isActive: false }))
  document.body.style.cursor = 'default'
}

function componentWillReceiveProps(nextProps) {
  if (nextProps.isActive) {
    document.body.style.cursor = 'pointer'
  }
  return nextProps
}

const handleOnClick = ({ dispatch, selectedNode: { name, type } }) => () => {
  dispatch(updateContextualDelete({ isActive: false }))
  // Avoid recursive when is a relation node.
  dispatch(markNodeReadyToDelete({ name, recursive: type !== 'relation' }))
}

export default compose(
  connect(mapStateToProps),
  withHandlers({ handleOnMouseLeave, handleOnClick }),
  lifecycle({ componentWillReceiveProps, }),
  branch(
    ({ isActive }) => !isActive,
    renderNothing
  )
)(ContextualDelete)