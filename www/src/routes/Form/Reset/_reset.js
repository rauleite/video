import { injectReducer } from "../../../store/reducers"
import { ON_ENTER_HOOK } from './../../../utils/consts'
import Auth from "../../../modules/Auth"
import { isEmpty } from 'lodash'
import { send } from "../../../utils/ajax"

export default (store) => ({
  path: 'reset/:token',
  onEnter: (nextState, replace, callback) => {
    // Conveniencia
    if (Auth.isUserAuthenticated()) {
      replace('/')
      return callback()
    }

    // Se ha path e token
    let isPathAndTokenOk = () => (
      nextState &&
      nextState.params &&
      !isEmpty(nextState.params.token) &&
      nextState.location &&
      nextState.location.pathname
    )

    // Se ha path e token
    if (isPathAndTokenOk()) {
      send({ path: `/auth${nextState.location.pathname}` }, (err, res) => {
        if (err) {
          store.dispatch({
            type: ON_ENTER_HOOK,
            payload: {
              success: false,
              user: {
                passwordToken: res && res.user && res.user.passwordToken ? res.user.passwordToken : ''
              },
              errors: {
                summary: err.message ? err.message : 'Erro interno'
              }
            }
          })
          return callback()
        }
        store.dispatch({
          type: ON_ENTER_HOOK,
          success: true,
          payload: {
            user: {
              token: res && res.user && res.user.token ? res.user.token : '',
              email: (res && res.user && res.user.email) ? res.user.email : ''
              // password: '',
              // confirmePassword: ''
            },
            success: true
          }
        })
        return callback()
      })
    }
  },
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cbReplace) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      // dynamic imports
      const Reset = require("./ResetContainer").default
      const reducer = require("./resetReducers").default

      /*  Add the reducer to the store on key 'forgot'  */
      injectReducer(store, { key: 'reset', reducer })

      /*  Return getComponent   */
      cbReplace(null, Reset)

    /* Webpack named bundle   */
    }, 'reset')
  }
})
