import { PROCESS_FORM, CHANGE_USER, LOCATION_CHANGE } from './../../../utils/consts'
import { deepFreeze } from '../../utils/dev-mode'
import { initialState } from './../../../utils/initialState'
import { changeUser } from './signupLogic'
import { setAllStates, setMapStates } from './../../../utils/logicUtils'

export default function signupReducer (state = initialState, action) {
  deepFreeze(state)
  console.info('SIGNUP REDUCER')
  console.info('|__ state', state)
  console.info('|__ action', action)
  switch(action.type) {
    case CHANGE_USER: {
      const result = changeUser(state, action)
      return setMapStates(state, result)
    }
    case PROCESS_FORM: {
      return setAllStates(state, action.payload)
    }
    case LOCATION_CHANGE: {
      return initialState
    }
    default:
      return state
  }
}
