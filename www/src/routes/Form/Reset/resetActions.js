import { CHANGE_USER, PROCESS_FORM } from './../../../utils/consts'
import { redirectToUrl } from '../../../utils/url'
import { sendForm } from './../../../utils/formUtils'
import { style, className } from './../../../utils/logicUtils'

/**
 * Action para onChange
 *
 * @param {event} event Evento onChange
 * @return {function} Redux Thunk
 */
export function changeUser (event) {
  return {
    type: CHANGE_USER,
    payload: {
      input: event.target
    }
  }
}

/**
 * @param {object} event - the JavaScript event object
 */
export function processForm (event) {
  event.preventDefault()
  return (dispatch, getState) => {
    const user = getState().reset.get('user').toJS()
    console.log('user', user)
    sendForm('/auth/reset', { body: user }, (error, res) => {
      if (error) {
        return dispatch({
          type: PROCESS_FORM,
          payload: {
            errors: {
              email: ' ',
              password: ' '
            },
            button: {
              label: 'ERRO',
              disabled: true
            },
            user: {
              email: ' ',
              password: ' '
            },
            styles: {
              infoMessage: className.error,
              email: style.error,
              password: style.error
            },
            // success: false,
            successMessage: error.summary
          }
        })
      }

      localStorage.setItem('successMessage', res.message)
      localStorage.setItem('email', res.data.email)

      redirectToUrl('/login')
    })
  }
}
