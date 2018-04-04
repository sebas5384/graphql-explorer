import boot from 'redux-boot'
import { composeWithDevTools } from 'redux-devtools-extension'

import editorModule from './modules/editor/store'
import sidebarModule from './modules/sidebar/store'

// DevTools
const devToolsModule = {
  enhancer: composeWithDevTools()
}

const modules = [
  editorModule,
  sidebarModule,
  devToolsModule,
]

const createStore = () => boot({}, modules)

export default createStore
