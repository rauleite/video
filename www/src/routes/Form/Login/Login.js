import React from 'react'
import { Card, CardText, CardTitle } from 'material-ui/Card'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import FacebookEnter from '../../../components/Buttons/Facebook/FacebookEnter'
import Borda from "../../../layouts/Borda/Borda"
import ReCAPTCHA from 'react-google-recaptcha'

import { Link } from 'react-router'
// import '../../../styles/icons/scss/material-design-iconic-font.css'
// import '../../../styles/core.css'

const Login = ({
  onSubmit,
  onChange,
  onChangeCaptcha,
  errors,
  styles,
  button,
  successMessage,
  user,
  captcha
}) => (
  <Borda>
    <Card >
      <form action='/' onSubmit={onSubmit}>
        <div className='center-xs'>
          <CardTitle
            title={<i className='zmdi zmdi-account zmdi-hc-3x' ></i>}
            subtitle='Faça seu login e bom proveito' />

          { successMessage ? <p className={styles.get('infoMessage')}>{ successMessage }</p> : '' }
          { errors.get('summary') && <p className='error-message'>{ errors.get('summary') }</p> }

          <p /><FacebookEnter >login</FacebookEnter>
          <br />&nbsp;
          <hr className='hr-text' data-content='Ou' />
          <TextField
            floatingLabelText={<i className='zmdi zmdi-email zmdi-hc-lg'></i>}
            hintText='Email'
            tabIndex='1'
            autoFocus
            name='email'
            errorText={errors.get('email')}
            onChange={onChange}
            value={user.get('email')}
            floatingLabelShrinkStyle={styles.get('email')}
            errorStyle={styles.get('email')}
          />
          <br />
          <TextField
            floatingLabelText={<i className='zmdi zmdi-key zmdi-hc-lg'></i>}
            hintText='Senha'
            tabIndex='2'
            type='password'
            name='password'
            onChange={onChange}
            errorText={errors.get('password')}
            value={user.get('password')}
            floatingLabelShrinkStyle={styles.get('password')}
            errorStyle={styles.get('password')}
          />
          <br />
          <br />

          { hasRenderCaptcha(captcha.get('hasCaptchaComponent'), onChangeCaptcha, onChange) }

          <RaisedButton type='submit' label={button.get('label') ? button.get('label') : 'LOG IN'}
            primary disabled={button.get('disabled')} />
          <CardText>
            <Link to='/forgot'><i className='zmdi zmdi-help'></i> Esqueceu a senha?</Link>
          </CardText>
          <CardText>
            Ainda não tem cadastro?<Link to={'/signup'}> <i className='zmdi zmdi-account-add'></i> Crie uma conta</Link>.
          </CardText>
        </div>
      </form>
      <br />
    </Card>
  </Borda>

)

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeCaptcha: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  button: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  captcha: PropTypes.object.isRequired
}

function hasRenderCaptcha (hasRender, onChangeCaptcha, onChange) {
  console.log('hasRender ---', hasRender)
  if (hasRender) {
    return (
      <center>
        <ReCAPTCHA
          ref={onChangeCaptcha}
          sitekey='6LcBpRoUAAAAABxVZrn9Qv7YwNsZaF9Vip7LNLDH'
          onChange={onChange}
          theme='dark'
        />
        <br />
      </center>
    )
  }
}

export default Login
