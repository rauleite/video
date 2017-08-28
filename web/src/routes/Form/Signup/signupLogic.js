import { style,
  className,
  inputUser,
  validateEmailWithStyles,
  validatePasswordWithStyles,
  validateNameWithStyles
} from './../../../utils/logicUtils'

import { objInitialState } from './../../../utils/initialState'
import { isEmpty } from 'lodash'

export function changeUser (state, action) {
  const fieldNames = [
    'name',
    'email',
    'password'
  ]
  const fieldNamesSignupHome = [
    'nameSignupHome',
    'emailSignupHome',
    'passwordSignupHome'
  ]

  const result = objInitialState

  let { user, isField } = inputUser(
    state, action, fieldNames.concat(fieldNamesSignupHome))

  let userSignupHome = null
  let sufixo = ''
  fieldNamesSignupHome.forEach((f, index) => {
    if (isField[f]) {
      sufixo = 'SignupHome'
      userSignupHome = user
      user = null
      return
    }
  })
  console.log('user', user)
  console.log('userSignupHome', userSignupHome)
  const userTemp = user || userSignupHome

  const name = userTemp[`name${sufixo}`]
  const email = userTemp[`email${sufixo}`]
  const password = userTemp[`password${sufixo}`]

  result.user.name = name
  result.user.email = email ? email.trim() : email
  result.user.password = password ? password.trim() : password

  console.log('result.user.name', result.user.name)

  validateNameWithStyles(result)
  validateEmailWithStyles(result)
  validatePasswordWithStyles(result)

  result.button.disabled = isDisableButton(result, style)

  fieldNames.forEach((f) => {
    if (isEmpty(result.user[f])) {
      result.styles[f] = style.default
      result.errors[f] = ' '
    }
  })

  if (state.get('successMessage')) {
    result.styles.infoMessage = className.success
  }

  const resultFinal = {
    errors: result.errors,
    styles: result.styles,
    button: result.button,
  }
  console.log('sufixo', sufixo)
  if (sufixo) {
    resultFinal[`user${sufixo}`] = result.user
    result.user = null
  } else {
    resultFinal.user = result.user
  }

  console.log('resulFinal', resultFinal)

  return resultFinal
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
  return isDisabled
}

/**
 * Envia user pra cadastro
 * @param {object} user
 * @param {string} reducerType
 * @param {object} dispatch
 * @param {function} callback
 */
// export function sendUserToSignup(user, reducer, dispatch, callback) {
//   sendForm('/auth/signup', { body: user }, (error, res) => {
    
//     if (reducerType)
//     dispatch({
//       type: 'SIGNUP_HOME',
//       signupHome: {
//         type: reducer.form,
//         payload: {
//           button: {
//             label: 'ENVIANDO...',
//             disabled: true
//           }
//         }
//       }
//     })
//     if (error) {
//       callback(error, res)
//     }
//     console.log(res)
//     console.log(res.success)
//     if (res && res.success) {
//       console.log('entrou')
//       console.log(res)
//       console.log(res.success)
//       dispatch({
//         type: reducer.change,
//         payload: {
//           user
//         }
//       })
//       callback(null, res)
//       redirectToUrl('/login')
//     }
//   })
// }