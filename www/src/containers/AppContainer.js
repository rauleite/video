import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Router, browserHistory } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Provider } from 'react-redux'
import theme from './theme'

export default class AppContainer extends PureComponent {

  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  render () {
    const { routes, store } = this.props

    return (
      <MuiThemeProvider muiTheme={theme}>
        <Provider store={store}>
          <div style={{ height: '100%' }}>
            <Router history={browserHistory} children={routes} />
          </div>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
