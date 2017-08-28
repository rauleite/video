import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'counter',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cbReplace) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      // dynamic imports
      const Counter = require('./containers/CounterContainer').default
      const reducer = require('./modules/counter').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'counter', reducer })

      /*  Return getComponent   */
      cbReplace(null, Counter)

    /* Webpack named bundle   */
    }, 'counter')
  }
})
