import React from 'react'
// import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { Card } from 'material-ui/Card'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import HomeContainerBase from "../Home/HomeContainerBase"
import FacebookEnter from "../../../components/Buttons/Facebook/FacebookEnter"
// import '../../../styles/icons/scss/material-design-iconic-font.css'

const LoginHome = ({
  onSubmitLogin,
  onChangeLogin,
  login
}) => {
  return (
    <Card>
      <form action='/' onSubmit={onSubmitLogin}>
        <br />
        <FacebookEnter >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;login &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</FacebookEnter>
        <br />&nbsp;
        <hr className='hr-text' data-content='Ou' />

        <TextField
          hintText='Email'
          tabIndex='1'
          name='email'
          onChange={onChangeLogin}
          floatingLabelShrinkStyle={login.getIn(['styles', 'email'])}
          value={login.getIn(['user', 'email'])}
          errorText={login.getIn(['errors', 'email'])}
          errorStyle={login.getIn(['styles', 'email'])}
        />

        <p />

        <TextField
          hintText='Senha'
          tabIndex='2'
          type='password'
          name='password'
          onChange={onChangeLogin}
          floatingLabelShrinkStyle={login.getIn(['styles', 'password'])}
          value={login.getIn(['user', 'password'])}
          errorText={login.getIn(['errors', 'password'])}
          errorStyle={login.getIn(['styles', 'password'])}
        />
        
        <p />&nbsp;
      
        {/*icon={<i className="zmdi zmdi-key zmdi-hc-1x"></i>}*/}
        <RaisedButton
          type='submit'
          style= {
            {
              lineHeight: '0px',
              minWidth: '0px'
            }
          }
          label='Log In'
          primary={!login.getIn(['button', 'disabled'])}
          disabled={login.getIn(['button', 'disabled'])} />
      </form>
      <br />&nbsp;
    </Card>
  )
}

const ImmutablePropTypes = require("../../utils/dev-mode").ImmutablePropTypes
console.log('ImmutablePropTypes', ImmutablePropTypes ? true : false)
if (ImmutablePropTypes) {
  LoginHome.propTypes = {
    onSubmitLogin: PropTypes.func.isRequired,
    onChangeLogin: PropTypes.func.isRequired,
    login: ImmutablePropTypes.mapContains({
      styles: ImmutablePropTypes.map.isRequired,
      button: ImmutablePropTypes.map.isRequired,
      errors: ImmutablePropTypes.map.isRequired,
      user: ImmutablePropTypes.map.isRequired
    })
  }
}

// export default LoginHome
export default HomeContainerBase(LoginHome)
