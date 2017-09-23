import { injectReducer } from "../../../store/reducers"

export default (store) => ({
  path: 'forgot',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cbReplace) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      // dynamic imports
      const Forgot = require("./ForgotContainer").default
      const reducer = require("./forgotReducers").default

      /*  Add the reducer to the store on key 'forgot'  */
      injectReducer(store, { key: 'forgot', reducer })

      /*  Return getComponent   */
      cbReplace(null, Forgot)

    /* Webpack named bundle   */
    }, 'forgot')
  }
})
