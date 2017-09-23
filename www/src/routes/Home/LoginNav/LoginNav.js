import React from 'react'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton'
// import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import HomeContainerBase from "../Home/HomeContainerBase"
import FacebookEnter from '../../../components/Buttons/Facebook/FacebookEnter'
// import "../../../styles/icons/scss/material-design-iconic-font.css"

const textStyle = {
  width: '140px',
  fontSize: 'small',
  marginLeft: '1px',
}

const LoginNav = ({
  onSubmitLogin,
  onChangeLogin,
  login
}) => {
  return (
    <form action='/' onSubmit={onSubmitLogin}>
      <TextField
        hintText='Email'
        tabIndex='1'
        name='email'
        style={textStyle}
        onChange={onChangeLogin}
        value={login.getIn(['user', 'email'])}
        floatingLabelShrinkStyle={login.getIn(['styles', 'email'])}
        errorStyle={login.getIn(['styles', 'email'])}
      />
      &nbsp;
      <TextField
        hintText='Senha'
        tabIndex='2'
        style={textStyle}
        type='password'
        name='password'
        onChange={onChangeLogin}
        value={login.getIn(['user', 'password'])}
        floatingLabelShrinkStyle={login.getIn(['styles', 'password'])}
        errorStyle={login.getIn(['styles', 'password'])}
      />
      &nbsp;
      <FlatButton
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

      &nbsp;
      <span className='hidden-down-sm'>
        <FacebookEnter >login</FacebookEnter>
      </span>
      <span className='hidden-up-md'>
        <FacebookEnter />
      </span>
    </form>
  )
}

const ImmutablePropTypes = require("../../utils/dev-mode").ImmutablePropTypes
console.log('ImmutablePropTypes', ImmutablePropTypes ? true : false)
if (ImmutablePropTypes) {
  LoginNav.propTypes = {
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

// LoginNav.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
//   // onChangeCaptcha: PropTypes.func.isRequired,
//   // errors: PropTypes.object.isRequired,
//   styles: PropTypes.object.isRequired,
//   button: PropTypes.object.isRequired,
//   // successMessage: PropTypes.string.isRequired,
//   user: PropTypes.object.isRequired
//   // captcha: PropTypes.object.isRequired
// }

// export default LoginNav
export default HomeContainerBase(LoginNav)
