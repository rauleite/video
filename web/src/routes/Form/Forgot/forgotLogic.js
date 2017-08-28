import { inputUser, validateEmailWithStyles } from './../../../utils/logicUtils'
import { objInitialState } from './../../../utils/initialState'

export function changeUser (state, action) {
  const fieldsStr = ['email']

  const { user } = inputUser(state, action, fieldsStr)

  const result = objInitialState

  if (!user.email) {
    return changeForgotState(result)
  }

  result.user.email = user.email

  const isValidEmail = validateEmailWithStyles(result)
  if (isValidEmail) {
    result.button.disabled = false
  }

  return changeForgotState(result)
}

/**
 * Muda o estado com valors atuais
 * @param {object} result As propriedades deste parametro, devem conter o mesmo nome do State
 */
function changeForgotState ({ user, styles, errors, button }) {
  return {
    user,
    styles,
    errors,
    button
  }
}
