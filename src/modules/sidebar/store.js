import { BOOT } from 'redux-boot'
import { createAction } from 'redux-actions'
import { over, lensPath } from 'ramda'

export const toggleSidebar = createAction('sidebar/TOGGLE')
export const resetSidebar = createAction('sidebar/RESET')

const getInitialState = state => ({
  ...state,
  sidebar: {
    isOpen: false
  }
})

const reducer = {
  [BOOT]: (state, action) => getInitialState(state),
  [resetSidebar]: (state, action) => getInitialState(state),
  [toggleSidebar]: (state, action) => over(
    lensPath(['sidebar', 'isOpen']),
    value => !value
  )(state)
}

export default { reducer }