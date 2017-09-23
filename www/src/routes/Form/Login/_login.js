import { injectReducer } from "../../../store/reducers"

export default (store) => ({
  path: 'login',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cbReplace) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      // dynamic imports
      const Login = require('./LoginContainer').default
      const reducer = require("./loginReducers").default

      /*  Add the reducer to the store on key 'login'  */
      injectReducer(store, { key: 'login', reducer })

      /*  Return getComponent   */
      cbReplace(null, Login)

    /* Webpack named bundle   */
    }, 'login')
  }
})
