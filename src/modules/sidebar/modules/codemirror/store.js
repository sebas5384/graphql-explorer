import { createAction } from 'redux-actions'
import { BOOT } from 'redux-boot'
import lscache from 'lscache'

export const updateCodeEditorValue = createAction(
  'sidebard/code-editor/UPDATE_VALUE'
)

const INITIAL_SCHEMA = `
type Product {
  id: ID!
  name: String!
}

type User {
  id: ID!
  wishlist: [Product!]!
}

type RootQuery {
  product(id: ID!): Product
}

schema {
  query: RootQuery
}`

const getInitialState = (state) => ({
  ...state,
  sidebarCodeEditor: lscache.get('sidebarCodeEditor') || {
    value: INITIAL_SCHEMA,
  },
})

const reducer = {
  [BOOT]: getInitialState,
  [updateCodeEditorValue]: (state, action) => {
    return { ...state, sidebarCodeEditor: { value: action.payload } }
  },
}

// const middleware = {
//   [updateCodeEditorValue]: store => next => action => {
//     return next(action)
//   }
// }

const enhancer = (createStore) => (reducer, initialState, enhancer) => {
  const store = createStore(reducer, initialState, enhancer)

  // Updates local storage.
  store.subscribe(() => {
    const state = store.getState()

    lscache.set('sidebarCodeEditor', state.sidebarCodeEditor)
  })

  return store
}

export default { reducer, enhancer }
