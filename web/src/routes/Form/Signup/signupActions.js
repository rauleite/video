import { CHANGE_USER, PROCESS_FORM } from './../../../utils/consts'
import { redirectToUrl } from '../../../utils/url'
import { sendForm } from './../../../utils/formUtils'

/**
 * Action para onChange
 *
 * @param {event} event Evento onChange
 * @return {funciton} Redux Thunk
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
    const user = getState().signup.get('user').toJS()
    console.log('user', user)

    sendForm('/auth/signup', { body: user }, (error, res) => {
      dispatch({
        type: PROCESS_FORM,
        payload: {
          button: {
            label: 'ENVIANDO...',
            disabled: true
          }
        }
      })
      if (error) {

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
      } else {

      }
    })
  }
}
