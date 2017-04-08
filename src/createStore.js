import boot from 'redux-boot'

import editorModule from './modules/editor/store'

const modules = [
  editorModule,
]

const createStore = () => boot({}, modules)
export default createStore
