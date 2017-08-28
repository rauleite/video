import { orange700, green700, red700, cyan700 } from 'material-ui/styles/colors'
import { Map } from 'immutable'

/* Para estilos material-ui components */
export let style = {
  success: { color: green700 },
  warning: { color: orange700 },
  error: { color: red700 },
  default: { color: cyan700 }
}

/* Para classes scss */
export let className = {
  success: 'success-message',
  warning: 'warning-message',
  error: 'error-message'
}

export const messages = {
  password: {
    empty: 'Tem que digitar uma senha ¬¬',
    small: 'Deve ter no mínimo 8 caracteres.',
    notMatch: '=/',
    correct: '=D'
  },
  confirmeEmail: {
    notMatch: 'A senha e confirmação não coincidem.',
    correct: '=D'
  }
}

/**
 * Handle Comon input
 * @param {object} action
 */
export function inputUser (state, action, fieldNames) {
  const input = extractStateProp(state, action, 'input')

  // console.log('input', input)

  const isField = isCorrectField(fieldNames, input)

  let user = {}
  fieldNames.forEach(function (f) {
    user[f] = input.name === f ? input.value : state.getIn(['user', f]) || ''
  })
  return { user, isField }
}

/**
 * Retorna o State[propName]
 * @param {object} state
 * @param {object} action
 * @param {string} propName
 * @returns {object} prop
 */
export function extractStateProp (state, action, propName, isNullAlternative) {
  return (
  // eslint-disable-next-line
  action.payload &&
  /* Se houver payload.propName, mesmo que seja string vazia */
  // eslint-disable-next-line
  action.payload[propName] || action.payload[propName] === ''
    ? action.payload[propName]
    : isNullAlternative ? null : state.get(propName)
  )
}

/**
 * Retorna objeto contendo campo atual como true
 * @param {Array} fieldNames field names
 * @param {object} input element input
 * @returns {object}
 */
function isCorrectField (fieldNames, input) {
  let isField = {}
  fieldNames.forEach(function (f) {
    isField[f] = input.name === f
  })
  return isField
}

/**
 * Valida email e ja adiciona os devidos styles (Modifica objeto result)
 * @param {object} result state result
 */
export function validateNameWithStyles (result) {
  if (validateName(result.user.name)) {
    result.styles.name = style.success
    result.errors.name = ' '
    return true
  } else {
    result.styles.name = style.warning
    result.errors.name = '(nome completo)'
    return false
  }
}

/**
 * Valida email e ja adiciona os devidos styles (Modifica objeto result)
 * @param {object} result state result
 */
export function validateEmailWithStyles (result) {
  if (validateEmail(result.user.email)) {
    result.styles.email = style.success
    result.errors.email = ' '
    return true
  } else {
    result.styles.email = style.warning
    result.errors.email = ' '
    return false
  }
}

/**
 * Valida password e ja adiciona os devidos styles (Modifica objeto result)
 * @param {object} result
 */
export function validatePasswordWithStyles (result) {
  const passwordLt = result.user.password.length < 8
  const passwordZero = result.user.password.length === 0

  if (passwordZero) {
    result.styles.password = style.default
    result.errors.password = ' '
    return
  }

  if (!validatePassword(result.user.password)) {
    result.styles.password = style.error
    result.errors.password = 'Não pode ter espaços'
  } else if (passwordLt) {
    result.styles.password = style.warning
    result.errors.password = '8 dígitos no mínimo'
  } else {
    result.styles.password = style.success
    result.errors.password = ' '
  }
}

/**
 * Valida o email
 * @param {string} email email em questão
 */
export function validateEmail (email) {
  var re = new RegExp([
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|',
    '(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|',
    '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
  ].join(''))
  return re.test(email)
}

/**
 * Valida o password
 * @param {string} password senha em questão
 */
export function validatePassword (password) {
  var re = /\s/
  return !re.test(password)
}

/**
 * Mínimo tem que ser 2 nomes com 2 digitos (eg. 'Ab Cd')
 * @param {string} name
 */
function validateName (name) {
  if (name) {
    name = name.trim()
    const names = name.split(' ')
    return names.length >= 2 && names[0].length >= 2 && names[1].length >= 2
  } else {
    return false
  }
}

/**
 * Set all state, Map via state.setIn()
 * and Plain Object via state.set()
 * @param {object} state
 * @param {object} payload 
 */
export function setAllStates (state, payload) {
  return state.withMutations(state => {
    for (let key in payload) {
      if (payload.hasOwnProperty(key)) {
        if (payload[key]) {
          const stateKey = state.get(key)
          if (Map.isMap(stateKey)) {
            /* Merge old state, with new obj */
            state.set(key, stateKey.concat(payload[key]))
            continue
          }
          state.set(key, payload[key])
        }
      }
    }
  })
}

/**
 * Set state that are Map like, via state.setIn()
 * @param {object} state
 * @param {object} payload
 */
export function setMapStates (state, payload) {
  return state.withMutations(state => {

    for (let key in payload) {
      state.set(key, state.get(key).concat(payload[key]))
    }
  })
}
