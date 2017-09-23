import { PROCESS_FORM, ON_ENTER_HOOK, CHANGE_USER, LOCATION_CHANGE } from './../../../utils/consts'
import { deepFreeze } from '../../utils/dev-mode'
import { changeUser } from './resetLogic'
import { initialState } from './../../../utils/initialState'
import { setAllStates, setMapStates } from './../../../utils/logicUtils'

export default function resetReducer (state = initialState, action) {
  deepFreeze(state)
  console.log('resetReducer', action.type)
  /* *** PROCESS FORM *** */
  if (action.type === PROCESS_FORM) {
    return setAllStates(state, action.payload)

  /* *** ON ENTER HOOK *** */
  } else if (action.type === ON_ENTER_HOOK) {
    return setAllStates(state, action.payload)

    /* *** CHANGE USER *** */
  } else if (action.type === CHANGE_USER) {
    const result = changeUser(state, action)
    return setMapStates(state, result)

  /* *** LOCATION CHANGE *** */
  } else if (action.type === LOCATION_CHANGE) {
    return initialState
  } else {
    return state
  }
}
