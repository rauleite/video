import { Map } from 'immutable'

export const initialState = initialStateImmutable()

/**
 * Apenas representa o initialState
 */
export let objInitialState

(() => { objInitialState = initialStateImmutable().toJS() })()

/**
 * Apenas representa o initialState
 */
function initialStateImmutable () {
  const user = Map({
    name: '',
    passwordToken: '',
    email: '',
    password: '',
    confirmePassword: '',
    token: ''
  })

  const errors = Map({
    name: '',
    email: '',
    password: '',
    confirmePassword: '',
    captcha: '',
    summary: '',
    /** Erro de Preenchimento, front */
    errorForm: false
  })

  const input = {}

  const styles = Map({
    infoMessage: {},
    name: {},
    email: {},
    password: {},
    confirmePassword: {},
    captcha: {}
  })

  const button = Map({
    label: '',
    disabled: true
  })

  const captcha = Map({
    value: {},
    element: {},
    hasCaptchaComponent: false
  })

  const rawState = {
    errors,
    user,
    input,
    styles,
    button,
    captcha
  }

  const loginNav = Map({
    ...rawState 
  })
  const login = Map({
    ...rawState
  })
  const signup = Map({
    ...rawState
  })

  return Map({
    ...rawState,
    
    home: Map({
      loginNav,
      login,
      signup,
    }),

    /* Vem do server */
    success: true,
    successMessage: ''
  })
}
