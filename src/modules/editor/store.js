import { BOOT } from 'redux-boot'

export default {
  reducer: {
    [BOOT]: (state, action) => {

      const newState = {
        ...state,
        types: [],
      }

      return newState
    }
  }
}
