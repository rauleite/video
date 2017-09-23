// import Signup from "../../Form/Signup/Signup"
// import SignupHomeContainer from "./SignupHomeContainer"
import HomeContainerBase from "../Home/HomeContainerBase"
import { Card } from 'material-ui/Card'
import React from 'react'
import PropTypes from 'prop-types'
import FacebookEnter from "../../../components/Buttons/Facebook/FacebookEnter"

import "../../../styles/icons/scss/material-design-iconic-font.css"

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const SignupHome = ({
  onSubmitSignup,
  onChangeSignup,
  signup
}) => (
  <Card>
    <form action='/' onSubmit={onSubmitSignup}>
      {/*<CardTitle
        subtitle='Faça seu cadastro e tenha acesso a conteúdo gratuito'
      />*/}
      <div>
        <br />
        <FacebookEnter >cadastre-se</FacebookEnter>
        <br />&nbsp;
        <hr className='hr-text' data-content='Ou' />
        <TextField
          floatingLabelText={<i className='zmdi zmdi-account zmdi-hc-lg'></i>}
          hintText='Nome'
          tabIndex='3'
          name='name'
          autoFocus
          onChange={onChangeSignup}

          value={signup.getIn(['user', 'name'])}
          errorText={signup.getIn(['errors', 'name'])}
          floatingLabelShrinkStyle={signup.getIn(['styles', 'name'])}
          errorStyle={signup.getIn(['styles', 'name'])}
          />
      </div>
      <div>
        <TextField
          floatingLabelText={<i className='zmdi zmdi-email zmdi-hc-lg'></i>}
          hintText='Email'
          tabIndex='4'
          name='email'
          onChange={onChangeSignup}

          value={signup.getIn(['user', 'email'])}
          errorText={signup.getIn(['errors', 'email'])}
          floatingLabelShrinkStyle={signup.getIn(['styles', 'email'])}
          errorStyle={signup.getIn(['styles', 'email'])}
          />
      </div>
      <div>
        <TextField
          floatingLabelText={<i className='zmdi zmdi-key zmdi-hc-lg'></i>}
          hintText='Senha'
          tabIndex='5'
          type='password'
          name='password'
          onChange={onChangeSignup}

          value={signup.getIn(['user', 'password'])}
          errorText={signup.getIn(['errors', 'password'])}
          floatingLabelShrinkStyle={signup.getIn(['styles', 'password'])}
          errorStyle={signup.getIn(['styles', 'password'])}
          />
      </div>
      <p />
      <br />
      <div>

        <RaisedButton
          type='submit'
          label={
            signup.getIn(['button', 'label']) ?
            signup.getIn(['button', 'label']) :
            'ENTRAR'
          }
          primary
          disabled={
            signup.getIn(['button', 'disabled'])
          }
        />
      </div>
    </form>
    <br />&nbsp;
  </Card>
)

const ImmutablePropTypes = require("../../utils/dev-mode").ImmutablePropTypes
console.log('ImmutablePropTypes', ImmutablePropTypes ? true : false)
if (ImmutablePropTypes) {
  SignupHome.propTypes = {
    onSubmitSignup: PropTypes.func.isRequired,
    onChangeSignup: PropTypes.func.isRequired,
    signup: ImmutablePropTypes.mapContains({
      styles: ImmutablePropTypes.map.isRequired,
      button: ImmutablePropTypes.map.isRequired,
      errors: ImmutablePropTypes.map.isRequired,
      user: ImmutablePropTypes.map.isRequired
    })
  }
}

// SignupHome.propTypes = {
//   onSubmitSignup: PropTypes.func.isRequired,
//   onChangeSignup: PropTypes.func.isRequired,
//   errors: PropTypes.object.isRequired,
//   styles: PropTypes.object.isRequired,
//   button: PropTypes.object.isRequired,
//   userSignupHome: PropTypes.object.isRequired,
// }

// export default SignupHome

export default HomeContainerBase(SignupHome)
