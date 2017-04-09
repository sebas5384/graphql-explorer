import { BOOT } from 'redux-boot'
import { createAction } from 'redux-actions'

export const updateNode = createAction('editor/node/UPDATE')
export const updateEdge = createAction('editor/edge/UPDATE')

const nodesMock = [
  {
    name: 'User',
    pos: { x: 100, y: 100 },
  },
  {
    name: 'Post',
    pos: { x: 400, y: 200 },
  }
]

const edgesMock = [
  {
    name: 'UserHasManyPost',
    nodes: ['User', 'Post'],
    type: 'hasMany',
    points: [100, 100, 400, 200],
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

    [updateNode]: (state, { payload }) => {
      const currentNode = state.nodes
        .find(type => type.name === payload.name)
      const updatedNodes = state.nodes
        .filter(node => node.name !== payload.name)
        .concat({ ...currentNode, pos: payload.pos })
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
    }
  },
  middleware: {
    [updateNode]: ({ dispatch }) => next => action => {
      const result = next(action)
      const { payload: { name, pos } } = action
      dispatch(updateEdge({ name, pos }))
      return result
    }
  }
}
