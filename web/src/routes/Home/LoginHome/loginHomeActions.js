import Auth from "../../../modules/Auth"
import { 
  CHANGE_USER,
  PROCESS_FORM,
} from './../../../utils/consts'

import { sendForm } from './../../../utils/formUtils'
import { style } from './../../../utils/logicUtils'
import { redirectToUrl, redirectToPrevUrl } from "../../../utils/url"

/**
 * @param {Object} Event Objeto de evento javascript
*/
export const onSubmitLogin = (event) => {
  event.preventDefault()

  return (dispatch, getState) => {
    dispatch({
      type: 'LOGIN_HOME',
      loginHome: {
        type: PROCESS_FORM,
        payload: {
          button: {
            label: 'ENVIANDO...',
            disabled: true
          }
        }
      }
    })
    
    const user = getState().home.getIn(['home', 'login', 'user']).toJS()
    console.log('**************user', user)
    // const captchaValue = captcha.value || {}
    const captchaValue = {}
    

    sendForm('/auth/login', { body: { ...user, captchaValue } }, (error, res) => {
      console.log('res login', res)
      if (error) {
        redirectToUrl('/login')
        const captcha = getState().login.get('captcha').toJS()
        console.log('captcha', captcha)
        if (captcha.hasCaptchaComponent) captcha.element.reset()
        return dispatch({
          type: 'LOGIN_HOME',
          loginHome: {
            type: PROCESS_FORM,
            payload: {
              errors: error,
              user: {
                email: '',
                password: ''
              },
              successMessage: '',
              styles: {
                email: style.error,
                password: style.error
              },
              captcha: {
                value: '',
                element: captcha.element,
                hasCaptchaComponent: res.hasCaptchaComponent
              },
              button: {
                label: 'REDIGITE...',
                disabled: true
              }
            }
          }
        })
      }
      Auth.authenticateUser(res.token)
      redirectToPrevUrl()
    })
  }
}

/**
 * Action para onChange
 *
 * @param {event} event Evento onChange
 * @return {object} action
 */
export const onChangeLogin = (event, value) => ({
  type: 'LOGIN_HOME',
  loginHome: {
    type: CHANGE_USER,
    payload: {
      input: event.target,
    }
  }
})
