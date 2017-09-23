import { 
  PROCESS_FORM,
  CHANGE_USER,
  LOCATION_CHANGE,
  CHANGE_CAPTCHA
} from './../../../utils/consts'
import { deepFreeze } from '../../utils/dev-mode'
import { initialState } from './../../../utils/initialState'
import { changeUser } from './loginLogic'
import { className, setAllStates, setMapStates } from './../../../utils/logicUtils'

export default function loginReducer (state = initialState, action) {
  deepFreeze(state)
  console.info('LOGIN REDUCER')
  console.info('|__ state.user', state.get('user'))
  console.info('|__ action', action)

  if (action && action.payload) {
    console.info('--- action.payload.captcha', action.payload.captcha)
  }
  switch(action.type) {
    /* *** PROCESS FORM *** */
    case PROCESS_FORM:
      return setAllStates(state, action.payload)
    /* *** CHANGE USER *** */
    case CHANGE_USER:
      const result = changeUser(state, action)
      return setMapStates(state, result)
    /* *** CHANGE CAPTCHA *** */
    case CHANGE_CAPTCHA:
      const currentCaptcha = action.payload.captcha

      if (currentCaptcha && currentCaptcha.element) {
        return state
          .setIn(['captcha', 'element'], currentCaptcha.element)
      }
      console.info('state NOT updated', state.toJS())
      return state
    /* *** LOCATION CHANGE *** */
    case LOCATION_CHANGE:
      const successMessage = localStorage.getItem('successMessage')
      const email = localStorage.getItem('email')

      localStorage.removeItem('successMessage')
      localStorage.removeItem('email')

      if (!successMessage) {
        console.info('não há localStorage')
        return initialState
      }
      
      return initialState
        .setIn(['styles', 'infoMessage'], className.success)
        .setIn(['user', 'email'], email)
        .set('successMessage', successMessage)
    default:
      return state
  }
}
