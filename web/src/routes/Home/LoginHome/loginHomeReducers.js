import { 
  PROCESS_FORM,
  CHANGE_USER,
} from './../../../utils/consts'

import { deepFreeze } from '../../utils/dev-mode'
import { changeUser } from '../../Form/Login/loginLogic'
import { initialState } from './../../../utils/initialState'
import { setMapStates, setAllStates } from './../../../utils/logicUtils'

export default function loginHomeReducer (state = initialState, action) {
  deepFreeze(state)
  console.log('loginHomeReducer', action.type)
  const stateLogin = state.getIn(['home', 'login'])

  switch (action.type) {
    case CHANGE_USER: {
      const result = changeUser(stateLogin, action)
      const stateResult = setMapStates(stateLogin, result)
      return state.setIn(['home', 'login'], stateResult)

    }
    case PROCESS_FORM: {
      const stateResult = setAllStates(stateLogin, action.payload)
      return state.setIn(['home', 'login'], stateResult)
    }

    default:
      return state
  }

}
