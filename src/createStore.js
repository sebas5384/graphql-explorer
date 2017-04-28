import boot from 'redux-boot'
import { composeWithDevTools } from 'redux-devtools-extension'

import editorModule from './modules/editor/store'

// DevTools
const devToolsModule = {
  enhancer: composeWithDevTools()
}

const modules = [
  editorModule,
  devToolsModule,
]

const createStore = () => boot({}, modules)

export default createStore
