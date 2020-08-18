import { createAction } from 'redux-actions'
import { BOOT } from 'redux-boot'
import lscache from 'lscache'
import { buildSchema } from 'graphql'
import {
  serializeSchemaToEditor,
  mergeSerializedToEditorState,
} from './lib/serializer'

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
    const schema = buildSchema(action.payload)
    const serializedSchema = serializeSchemaToEditor(schema)
    const newEditorState = mergeSerializedToEditorState(serializedSchema, state)
    return {
      ...state,
      ...newEditorState,
      sidebarCodeEditor: { value: action.payload },
    }
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
