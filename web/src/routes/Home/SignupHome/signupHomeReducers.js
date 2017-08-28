import { 
  PROCESS_FORM,
  CHANGE_USER,
} from './../../../utils/consts'

import { deepFreeze } from '../../utils/dev-mode'
import { changeUser } from '../../Form/Signup/signupLogic'
import { initialState } from './../../../utils/initialState'
import { setAllStates, setMapStates } from './../../../utils/logicUtils'

export default (state = initialState, action) => {
  deepFreeze(state)
  console.log('signupHomeReducer', action.type)

  const stateSignup = state.getIn(['home', 'signup'])

  switch (action.type) {
    case CHANGE_USER: {
      // const result = changeUser(
      //   normalizaParaEscrita(state), action)
        
      // return setMapStates(
      //   state, normalizaParaLeitura(result))

      const signupResult = changeUser(stateSignup, action)

      const stateSignupResult = setMapStates(stateSignup, signupResult)

      const stateResult = state.setIn(['home', 'signup'], stateSignupResult)
      // console.log('stateResult.toJS()', stateResult.toJS())
      return stateResult


    }
    case PROCESS_FORM : {

      // return setAllStates(
      //   normalizaParaEscrita(state), action.payload)

      const stateSignupResult = setAllStates(stateSignup, action.payload)
      return state.setIn(['home', 'signup'], stateSignupResult)
    }

    default:
      return state
  }
}

// /**
//  * Transforma atributo userLoginHome em user
//  * @param {object} state
//  * @return {state} estado atualizado
//  */
// const normalizaParaEscrita = (state) => {
//   return state.set('user', state.get('userSignupHome'))
// }

// /**
//  * Volta de user para userLoginHome
//  * @param {object} result
//  * @return {object} objeto result
//  */
// const normalizaParaLeitura = (result) => {
//   result.userSignupHome = result.user
//   delete result.user
//   return result
// }