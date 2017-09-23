import { CHANGE_USER, PROCESS_FORM } from './../../../utils/consts'
import { sendForm } from './../../../utils/formUtils'
import { redirectToUrl } from '../../../utils/url'
import { style, className } from './../../../utils/logicUtils'

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
        },
        styles: {
          infoMessage: className.warning,
          email: style.success
        },
        successMessage: 'Um segundo, enquanto procuramos seu email na base...'
      }
    })
    const user = getState().forgot.get('user').toJS()
    sendForm('/auth/forgot', { body: user }, (error, res) => {
      if (error) {
        return dispatch({
          type: PROCESS_FORM,
          payload: {
            errors: {
              email: ' '
            },
            button: {
              label: 'EMAIL INCORRETO',
              disabled: true
            },
            user: {
              email: ''
            },
            styles: {
              infoMessage: className.error,
              email: style.error
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

/**
 * Action para onChange
 *
 * @param {Event} event Evento onChange
 * @return {Function} Redux Thunk
 */
export function changeUser (event) {
  console.log('FORGOT processForm event', event)
  return {
    type: CHANGE_USER,
    payload: {
      input: event.target
    }
  }
}
