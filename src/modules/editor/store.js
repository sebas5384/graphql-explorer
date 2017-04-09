import { BOOT } from 'redux-boot'
import { createAction } from 'redux-actions'

export const updateNode = createAction('editor/node/UPDATE')
export const updateEdge = createAction('editor/edge/UPDATE')
export const selectNode = createAction('editor/node/SELECT')
export const addNode = createAction('editor/node/ADD')
export const addEdge = createAction('editor/edge/ADD')

const nodesMock = [
  {
    name: 'User',
    pos: { x: 200, y: 100 },
  },
  {
    name: 'Post',
    pos: { x: 400, y: 200 },
  },
  {
    name: 'Comment',
    pos: { x: 350, y: 400 },
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
  }
]

export default {
  reducer: {
    [BOOT]: (state, action) => {

      const newState = {
        ...state,
        nodes: nodesMock,
        edges: edgesMock
      }

      return newState
    },

    [addNode]: (state, { payload: newNode }) => {
      return { ...state, nodes: state.nodes.concat(newNode)}
    },

    [addEdge]: (state, { payload: { name } }) => {
      const regex = /^([a-zA-Z0-9]+)(HasMany|BelongsTo|HasOne|HasManyAndBelongsTo)([a-zA-Z0-9]+)$/
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

      const updatedNodes = state.nodes
        .filter(node => node.name !== payload.name)
        .concat({ ...currentNode, ...payload })

      return { ...state, nodes: updatedNodes }
    },

    [updateEdge]: (state, { payload: node }) => {
      const updatedEdges = state.edges
        .map(edge => {
          if (!edge.nodes.some(name => name === node.name)) return edge
          const points = edge.nodes
            .map(name => state.nodes.find(node => node.name === name ))
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
  },
  middleware: {
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

      nodesToUpdate.forEach(node => next(updateEdge(node)))
      return result
    }
  }
}
