import { 
  CHANGE_USER,
  PROCESS_FORM
} from './../../../utils/consts'
import { sendForm } from './../../../utils/formUtils'
import { redirectToUrl } from '../../../utils/url'

/**
 * Action para onChange
 *
 * @param {event} event Evento onChange
 * @return {funciton} Redux Thunk
 */
export function onChangeSignup (event) {
  return {
    type: 'SIGNUP_HOME',
    signupHome: {
      type: CHANGE_USER,
      payload: {
        input: event.target
      }
    }
  }
}

/**
 * @param {object} event - the JavaScript event object
 */
export function onSubmitSignup (event) {
  event.preventDefault()
  return (dispatch, getState) => {
    const user = getState().home.getIn(['home', 'signup', 'user']).toJS()
    sendForm('/auth/signup', { body: user }, (error, res) => {
      dispatch({
        type: 'SIGNUP_HOME',
        signupHome: {
          type: PROCESS_FORM,
          payload: {
            button: {
              label: 'ENVIANDO...',
              disabled: true
            }
          }
        }
      })
      if (error) {
        redirectToUrl('/signup')
        return
      }
      console.log(res)
      console.log(res.success)
      if (res && res.success) {
        console.log('entrou')
        console.log(res)
        console.log(res.success)
        dispatch({
          type: CHANGE_USER,
          payload: {
            user
          }
        })
        redirectToUrl('/login')
      }
    })
  }
}
