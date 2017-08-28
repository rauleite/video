import {
  style,
  className,
  inputUser,
  validateEmailWithStyles,
  validatePasswordWithStyles
} from './../../../utils/logicUtils'

import { objInitialState } from './../../../utils/initialState'
import { isEmpty } from 'lodash'

export const changeUser = (state, action) => {
  const fieldNames = ['email', 'password']
  const result = objInitialState

  const { user } = inputUser(state, action, fieldNames)

  result.user.email = user.email ? user.email.trim() : user.email
  result.user.password = user.password ? user.password.trim() : user.password

  const captcha = action.payload && action.payload.captcha ? action.payload.captcha : false
  if (captcha) result.captcha = captcha

  validateEmailWithStyles(result)
  validatePasswordWithStyles(result)

  result.button.disabled = isDisableButton(result, style)

  fieldNames.forEach((f) => {
    if (isEmpty(result.user[f])) {
      result.styles[f] = style.default
    }
  })

  if (state.get('successMessage')) {
    result.styles.infoMessage = className.success
  }

  return {
    user: result.user,
    errors: result.errors,
    styles: result.styles,
    button: result.button,
    captcha: result.captcha
  }
}

function isDisableButton (result, style) {
  let isDisabled = true

  if (
    result.styles.password === style.success &&
    result.styles.email === style.success
  ) {
    isDisabled = false
  } else {
    isDisabled = true
  }

  if (!isDisabled && result.captcha.hasCaptchaComponent) {
    if (!isEmpty(result.captcha.value)) {
      isDisabled = false
    } else {
      isDisabled = true
    }
  }
  return isDisabled
}
