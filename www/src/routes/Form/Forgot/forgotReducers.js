import { PROCESS_FORM, CHANGE_USER, LOCATION_CHANGE } from './../../../utils/consts'
import { deepFreeze } from '../../utils/dev-mode'
import { changeUser } from './forgotLogic'
import { initialState } from './../../../utils/initialState'
import { setAllStates, setMapStates } from './../../../utils/logicUtils'

export default function forgotReducer (state = initialState, action) {
  deepFreeze(state)
  console.log('forgotReducer', action.type)
  /* *** PROCESS_FORM *** */
  if (action.type === PROCESS_FORM) {
    if (action.payload.success) return state
    return setAllStates(state, action.payload)
  }
  /* *** CHANGE_USER *** */
  if (action.type === CHANGE_USER) {
    const result = changeUser(state, action)
    console.log('result', result)
    return setMapStates(state, result)
  }
  /* *** LOCATION_CHANGE *** */
  if (action.type === LOCATION_CHANGE) {
    return initialState
  }

  return state
}
