import AppContainer from './containers/AppContainer'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import injectTapEventPlugin from 'react-tap-event-plugin'

// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin()

console.log('NODE_ENV', process.env.NODE_ENV)


// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__

window.recaptchaOptions = {
  lang: 'pt_BR',
  theme: 'dark'
}

const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
            // if (__DEV__) {
            //   if (module.hot) {
            //     // Development render functions
            //     const renderApp = render
            //     const renderError = (error) => {
            //       const RedBox = require('redbox-react').default

            //       ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
            //     }

            //     // Wrap render in try/catch
            //     render = () => {
            //       try {
            //         renderApp()
            //       } catch (error) {
            //         console.error(error)
            //         renderError(error)
            //       }
            //     }

            //     // accept update of dependency
            //     module.hot.accept('./routes/index', () => {
            //       // replace request handler of server
            //       ReactDOM.unmountComponentAtNode(MOUNT_NODE)
            //       render()
            //     }
            //       // setImmediate(() => {
            //       // })
            //     )
            //   }
            // }

// ========================================================
// Go!
// ========================================================
render()
