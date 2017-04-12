import { BOOT } from 'redux-boot'
import { createAction } from 'redux-actions'

/*
 * Actions.
 */
export const updateStage = createAction('editor/stage/UPDATE')
export const updateNode = createAction('editor/node/UPDATE')
export const updateEdge = createAction('editor/edge/UPDATE')
export const selectNode = createAction('editor/node/SELECT')
export const addNode = createAction('editor/node/ADD')
export const addEdge = createAction('editor/edge/ADD')

/*
 * Helpers.
 */
export const normalizePosWithStage = ({ stage, pos }) => ({
  x: pos.x - stage.pos.x,
  y: pos.y - stage.pos.y,
})

/*
 * Mock of the State.
 */
const nodesMock = [
  {
    name: 'User',
    pos: { x: 200, y: 100 },
    selected: false,
  },
  {
    name: 'Post',
    pos: { x: 400, y: 200 },
    selected: false,
  },
  {
    name: 'Comment',
    pos: { x: 350, y: 400 },
    selected: false,
  },
  {
    name: 'Rank',
    pos: { x: 85, y: 400 },
    selected: false,
  },
  {
    name: 'Image',
    pos: { x: 110, y: 240 },
    selected: false,
  }
]

const edgesMock = [
  {
    name: 'UserHasManyPost',
    nodes: ['User', 'Post'],
    type: 'hasMany',
    points: [200, 100, 400, 200],
  },
  {
    name: 'UserHasManyComment',
    nodes: ['User', 'Comment'],
    type: 'hasMany',
    points: [200, 100, 350, 400],
  },
  {
    name: 'CommentHasManyRank',
    nodes: ['Comment', 'Rank'],
    type: 'hasMany',
    points: [350, 400, 85, 400],
  },
  {
    name: 'CommentHasOneUser',
    nodes: ['Comment', 'User'],
    type: 'hasOne',
    points: [350, 400, 200, 100],
  },
  {
    name: 'ImageBelongsToManyUser',
    nodes: ['Image', 'User'],
    type: 'BelongsToMany',
    points: [110, 240, 200, 100]
  }
]

/*
 * Selectors.
 */

export const getSelectedNode = (nodes = []) => nodes.find(node => node.selected)

/*
 * Reducers.
 */
export const reducer = {
  [BOOT]: (state, action) => {

    const newState = {
      ...state,
      nodes: nodesMock,
      edges: edgesMock,
      stage: { pos: { x: 0, y: 0 } },
    }

    return newState
  },

  [addNode]: (state, { payload: newNode }) => {
    const normalizedNode = {
      ...newNode,
      pos: normalizePosWithStage({ stage: state.stage, pos: newNode.pos })
    }
    return { ...state, nodes: state.nodes.concat(normalizedNode)}
  },

  [addEdge]: (state, { payload: { name } }) => {
    const regex = /^([a-zA-Z0-9]+)(HasMany|HasOne|BelongsToMany|BelongsTo)([a-zA-Z0-9]+)$/
    const [_, nodeA, type, nodeB] = regex.exec(name)
    const newEdge = {
      name,
      type,
      nodes: [nodeA, nodeB],
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
      pos: normalizePosWithStage({ stage: state.stage, pos: updatedNodePos })
    }

    const updatedNodes = state.nodes
      .filter(node => node.name !== payload.name)
      .concat(updatedNode)

    return { ...state, nodes: updatedNodes }
  },

  [updateEdge]: (state, { payload: node }) => {
    const updatedEdges = state.edges
      .map(edge => {
        if (!edge.nodes.some(name => name === node.name)) return edge
        const points = edge.nodes
          .map(name => state.nodes.find(node => node.name === name))
          .map(node => node.pos)
          .map(Object.values)
          .reduce((flat, pos) => flat.concat(pos), [])

        return { ...edge, points }
      })

    return { ...state, edges: updatedEdges }
  },

  [selectNode]: (state, { payload }) => {
    const updatedNodes = state.nodes
      .map(node => ({ ...node, selected: (node.name === payload.name) }))
    return { ...state, nodes: updatedNodes }
  },

  [updateStage]: (state, { payload }) => {
    return { ...state, stage: payload }
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
    dispatch(updateEdge({ name, pos }))
    return result
  },
  [addEdge]: ({ dispatch, getState }) => next => action => {
    const result = next(action)
    const { edges, nodes } = getState()
    // Set pointers for the new edge.
    const newEdge = edges.find(edge => edge.name === action.payload.name)

    const nodesToUpdate = nodes
      .filter(node => newEdge.nodes.some(name => name === node.name))

    nodesToUpdate.forEach(node => dispatch(updateEdge(node)))

    return result
  }
}

export default { reducer, middleware }
