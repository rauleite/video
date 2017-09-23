import { injectReducer } from "../../../store/reducers"

// // Sync route definition
// export default {
//   component : HomeView
// }

export default (store) => ({
  // path: '/',
  /* Async getComponent is only invoked when route matches */
  getComponent (nextState, cbReplace) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /* Webpack - use require callback to define
          dependencies for bundling */

      // dynamic imports
      const Home = require('./Home').default
      const reducer = require('./homeReducers').default
      // const loginHome = require("../LoginHome/loginHomeReducers").default
      // const signupHome = require("../SignupHome/signupHomeReducers").default

      /*  Add the reducer to the store on key 'home'  */
      injectReducer(store, { key: 'home', reducer })
      // injectReducer(store, { key: 'loginHome', reducer: loginHome })
      // injectReducer(store, { key: 'signupHome', reducer: signupHome })

      /*  Return getComponent   */
      cbReplace(null, Home)

    /* Webpack named bundle   */
    }, 'home')
  }
})
