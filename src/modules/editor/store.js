import { BOOT } from 'redux-boot'
import { createAction } from 'redux-actions'
import lscache from 'lscache'
import * as R from 'ramda'

import initialStateMock from './__mock__/initialState'

import { middlePositions } from './lib/middlePositions'

/*
 * Actions.
 */
export const updateStage = createAction('editor/stage/UPDATE')
export const updateNode = createAction('editor/node/UPDATE')
export const updateNodeFields = createAction('editor/field/UPDATE')
export const updateEdge = createAction('editor/edge/UPDATE')
export const selectNode = createAction('editor/node/SELECT')
export const resetSelectedNode = createAction('editor/node/SELECT_RESET')
export const addNode = createAction('editor/node/ADD')
export const addField = createAction('editor/field/ADD')
export const addEdge = createAction('editor/edge/ADD')
export const updateConnector = createAction('editor/connector/UPDATE')
export const resetConnector = createAction('editor/connector/RESET')

/*
 * Helper to normalize positions by stage position / offset.
 */

 export const normalizePosWithStage = ({ stage, pos }) => ({
  x: pos.x - stage.pos.x,
  y: pos.y - stage.pos.y,
})

/*
 * Helpers to centralize line points and positions by node type.
 */

 export const centralizeLinePoints = node => Object.values(node.pos)
  .map(pos => pos + centerPositionsByType(node.type))

export const centralizePositions = node =>
  R.map(pos => pos + centerPositionsByType(node.type), node.pos)

// @TODO this positions offsets should be centralized.
const centerPositionsByType = type => {
  switch (type) {
    case 'model':
      return 61
    case 'relation':
      return 45
    default:
  }
}

/*
 * Selectors.
 */

export const getSelectedNode = (nodes = []) => nodes.find(node => node.selected)
export const getConnectedNode = ({ nodes = [], connectedTo }) => nodes
  .find(({ name }) => name === connectedTo)

/*
 * Initial State.
 */
const getInitialState = state => ({
  ...state,
  nodes: lscache.get('nodes') || initialStateMock.nodes,
  edges: lscache.get('edges') || initialStateMock.edges,
  stage: { pos: { x: 0, y: 0 } },
  connector: {
    isConnecting: false,
    connectedTo: null,
  }
})

/*
 * Reducers.
 */
export const reducer = {
  [BOOT]: (state, action) => getInitialState(state),

  [addNode]: (state, { payload: newNode }) => {
    const normalizedNode = {
      ...newNode,
      pos: newNode.pos
    }
    return { ...state, nodes: state.nodes.concat(normalizedNode)}
  },

  [addEdge]: (state, { payload: { nodeA, nodeB, type } }) => {
    const newEdge = {
      type,
      nodes: [nodeA, nodeB],
      points: [],
    }
    return { ...state, edges: state.edges.concat(newEdge)}
  },

  [updateNode]: (state, { payload }) => {
    const currentNode = state.nodes
      .find(type => type.name === payload.name)

    const updatedNodePos = payload.hasOwnProperty('pos')
      ? payload.pos
      : currentNode.pos

    const updatedNode = {
      ...currentNode,
      ...payload,
      pos: updatedNodePos
    }

    const updatedNodes = state.nodes
      .filter(node => node.name !== payload.name)
      .concat(updatedNode)

    return { ...state, nodes: updatedNodes }
  },

  [updateEdge]: (state, { payload: { node } }) => {
    const updatedEdges = state.edges
      .map(edge => {
        if (!edge.nodes.some(name => name === node.name)) return edge
        const points = edge.nodes
          .map(name => state.nodes.find(node => node.name === name))
          .map(node => centralizeLinePoints(node))
          .reduce((flat, pos) => flat.concat(pos), [])
        return { ...edge, points }
      })

    return { ...state, edges: updatedEdges }
  },

  [updateNodeFields]: (state, { payload: { node: editingNode, fields } }) => {
    const updatedNodes = state.nodes.map(node => {
      if (node.name !== editingNode.name) return node
      return { ...node, fields }
    })
    return { ...state, nodes: updatedNodes }
  },

  [selectNode]: (state, { payload }) => {
    const updatedNodes = state.nodes
      .map(node => ({ ...node, selected: (node.name === payload.name) }))
    return { ...state, nodes: updatedNodes }
  },

  [resetSelectedNode]: (state, { payload }) => {
    const updatedNodes = state.nodes
      .map(node => ({ ...node, selected: false }))
    return { ...state, nodes: updatedNodes }
  },

  [updateStage]: (state, { payload }) => {
    return { ...state, stage: payload }
  },

  [updateConnector]: (state, { payload }) => {
    return { ...state, connector: { ...state.connector, ...payload } }
  },

  [resetConnector]: (state, action) => {
    return { ...state, connector: getInitialState(state).connector }
  }
}

/*
 * Middlewares.
 */
export const middleware = {
  [updateNode]: ({ dispatch }) => next => action => {
    const result = next(action)

    // Update the edges.
    const { payload: { name, pos } } = action
    dispatch(updateEdge({ node: { name, pos } }))
    return result
  },
  [addEdge]: ({ dispatch, getState }) => next => action => {
    const result = next(action)
    const { edges, nodes } = getState()
    const { nodeA, nodeB } = action.payload

    // Set pointers for the new edge.
    const newEdge = edges.find(
      edge => edge.nodes[0] === nodeA && edge.nodes[1] === nodeB
    )

    const nodesToUpdate = nodes
      .filter(node => newEdge.nodes.some(name => name === node.name))

    nodesToUpdate.forEach(node => {
      dispatch(updateEdge({ node }))
    })

    return result
  },
  [addField]: ({ dispatch, getState }) => next => action => {
    const result = next(action)
    const { nodes } = getState()
    const { name, nodeA, nodeB, type } = action.payload

    const selectedNodes = nodes.filter(
      node => [nodeA, nodeB].some(name => node.name === name)
    )

    // Create node for field.
    dispatch(addNode({
      name, 
      pos: middlePositions(selectedNodes),
      type: 'relation',
      selected: false,
      cardinality: type,
    }))
    
    // Create edge from nodeA to fieldNode.
    dispatch(addEdge({ nodeA, nodeB: name, type }))
    
    // Create edge from fieldNode to nodeB. 
    dispatch(addEdge({ nodeA: name, nodeB, type }))
    
    return result
  }
}

const enhancer = createStore => (reducer, initialState, enhancer) => {
  const store = createStore(reducer, initialState, enhancer)

  // Updates local storage.
  store.subscribe(() => {
    const state = store.getState()

    lscache.set('nodes', state.nodes)
    lscache.set('edges', state.edges)
  })

  return store
}


export default { reducer, middleware, enhancer }
