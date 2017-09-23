import { isEmpty } from 'lodash'
import { objInitialState } from './../../../utils/initialState'

import {
  inputUser,
  style
} from './../../../utils/logicUtils'

export function changeUser (state, action) {
  const fieldNames = ['password', 'confirmePassword']

  const result = objInitialState
  const { user } = inputUser(state, action, fieldNames)
  result.user = user
  result.user.passwordToken = window.location.pathname.replace(/\/reset\//, '')

  /* Se nao foi digitado nada nos dois campos: Reseta erros */
  if (
    (isEmpty(result.user.password)) &&
    (isEmpty(result.user.confirmePassword))
  ) {
    // console.log('isEmpty')
    result.errors.errorForm = false
    result.errors.password = ''
    result.errors.confirmePassword = ''
    result.styles.password = style.default
    result.styles.confirmePassword = style.default
    return changeState(result)
  }

  const passwordLt = result.user.password && result.user.password.length < 8
  const passwordGt = result.user.password && result.user.password.length >= 8

  if (passwordLt) {
    // console.log('passwordLt')
    result.errors.errorForm = true
    result.errors.password = 'Deve ter no mínimo 8 caracteres.'
    result.styles.password = style.warning
    return changeState(result)
  }

  const isPassAndConfirmMaches = (
    typeof result.user.password === 'string' &&
    typeof result.user.confirmePassword === 'string' &&
    result.user.password === result.user.confirmePassword
  )
  const isSameLengthButNotMatch = (
    typeof result.user.password === 'string' &&
    typeof result.user.confirmePassword === 'string' &&
    result.user.confirmePassword.length >= result.user.password.length &&
    result.user.password !== result.user.confirmePassword
  )
  if (passwordGt || isSameLengthButNotMatch || isPassAndConfirmMaches) {
    // console.log('passwordGt || isSameLengthButNotMatch || isPassAndConfirmMaches')
    if (isSameLengthButNotMatch) {
      // console.log('isSameLengthButNotMatch')
      result.errors.errorForm = true
      result.errors.password = '=/'
      result.errors.confirmePassword = 'A senha e confirmação não coincidem.'
      result.styles.password = style.error
      result.styles.confirmePassword = style.error
      return changeState(result)
    }
    if (isPassAndConfirmMaches) {
      // console.log('isPassAndConfirmMaches')
      result.button.disabled = false
      result.errors.errorForm = false
      result.errors.password = '=D'
      result.errors.confirmePassword = '=D'
      result.styles.password = style.success
      result.styles.confirmePassword = style.success
      result.button.disabled = false
      return changeState(result)
    }
    if (passwordGt) {
      // console.log('passwordGt')
      result.errors.errorForm = false
      result.errors.password = '=D'
      result.errors.confirmePassword = ' '
          result.styles.password = style.success
      result.styles.confirmePassword = style.warning
      return changeState(result)
    }
  }
}

/**
 * Configura o Dispatch para envio
 * @param {object} errors
 * @param {object} styles
 * @param {string} styleType
 * @param {Array} fieldsStyle
 */
function changeState (result) {
  return {
    user: result.user,
    errors: result.errors,
    styles: result.styles,
    button: result.button
  }
}
