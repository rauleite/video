import Auth from '../../../modules/Auth'
import { CHANGE_USER, PROCESS_FORM, CHANGE_CAPTCHA } from './../../../utils/consts'
// import { redirectToPrevUrl } from "../../../utils/url"
import { sendForm } from './../../../utils/formUtils'
import { style } from './../../../utils/logicUtils'
import { redirectToUrl, redirectToPrevUrl } from '../../../utils/url'

/**
 * @param {Object} Event Objeto de evento javascript
*/
export function processForm (event) {
  event.preventDefault()

  return (dispatch, getState) => {
    dispatch({
      type: PROCESS_FORM,
      payload: {
        button: {
          label: 'ENVIANDO...',
          disabled: true
        }
      }
    })
    const user = getState().login.get('user').toJS()
    const captcha = getState().login.get('captcha').toJS()
    const captchaValue = captcha.value || {}

    sendForm('/auth/login', { body: { ...user, captchaValue } }, (error, res) => {
      console.log('res login', res)
      if (error) {
      console.log('window.location', window.location)
      console.log('window.location.pathname !== /login', window.location.pathname !== '/login')
        
        if (window.location.pathname !== '/login') {
          return redirectToUrl('/login')
        }
        if (captcha.hasCaptchaComponent) captcha.element.reset()
        return dispatch({
          type: PROCESS_FORM,
          payload: {
            errors: error,
            user: user,
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
 * @param {Event} event Evento onChange
 * @return {Function} Redux Thunk
 */
export function changeUser (eventOrCaptcha) {
  console.log('eventOrCaptcha', eventOrCaptcha)

  const target = eventOrCaptcha && eventOrCaptcha.target ? eventOrCaptcha.target : null
  const captchaValue = eventOrCaptcha && !eventOrCaptcha.target ? eventOrCaptcha : null

  const actionResult = {
    type: CHANGE_USER,
    payload: {
      input: {},
      captcha: {}
    }
  }

  /* Be one or another */
  if (target) actionResult.payload.input = target
  if (captchaValue) actionResult.payload.captcha.value = captchaValue

  return actionResult
}

/**
 * Action para onChangeCaptcha
 *
 * @param {Event} tokenCaptcha Evento onChange
 * @return {Function} Redux Thunk
 */
export function changeCaptcha (element) {
  return {
    type: CHANGE_CAPTCHA,
    payload: { captcha: { element } }
  }
}
