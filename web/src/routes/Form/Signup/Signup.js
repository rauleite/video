import { Card, CardText, CardTitle } from 'material-ui/Card'
import React from 'react'
import PropTypes from 'prop-types'
import FacebookEnter from '../../../components/Buttons/Facebook/FacebookEnter'
import Borda from "../../../layouts/Borda/Borda"

// import '../../../styles/icons/scss/material-design-iconic-font.css'

import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const Signup = ({
  onSubmit,
  onChange,
  errors,
  styles,
  button,
  successMessage,
  user
}) => (
  <Borda>
    <Card>
      <form action='/' onSubmit={onSubmit}>
        <div className='center-xs'>

          <CardTitle
            title={<i className='zmdi zmdi-account-add zmdi-hc-3x'></i>}
            subtitle='Tenha acesso a muito conteúdo [significativo] gratuitamente'
          />
          {errors.summary && <p className='error-message'> {errors.summary} </p>}
          <div>
            <p /><FacebookEnter >facebook</FacebookEnter>
            <hr className='hr-text' data-content='Ou' />
            <TextField
              floatingLabelText={<i className='zmdi zmdi-account zmdi-hc-lg'></i>}
              hintText='Nome'
              tabIndex='1'
              name='name'
              autoFocus
              onChange={onChange}

              value={user.get('name')}
              errorText={errors.get('name')}
              floatingLabelShrinkStyle={styles.get('name')}
              errorStyle={styles.get('name')}
              />
          </div>
          <div>
            <TextField
              floatingLabelText={<i className='zmdi zmdi-email zmdi-hc-lg'></i>}
              hintText='Email'
              tabIndex='2'
              name='email'
              onChange={onChange}

              value={user.get('email')}
              errorText={errors.get('email')}
              floatingLabelShrinkStyle={styles.get('email')}
              errorStyle={styles.get('email')}
              />
          </div>
          <div>
            <TextField
              floatingLabelText={<i className='zmdi zmdi-key zmdi-hc-lg'></i>}
              hintText='Senha'
              tabIndex='3'
              type='password'
              name='password'
              onChange={onChange}

              value={user.get('password')}
              errorText={errors.get('password')}
              floatingLabelShrinkStyle={styles.get('password')}
              errorStyle={styles.get('password')}
              />
          </div>
          <p />
          <br />
          <div>

            <RaisedButton type='submit' label={button.get('label') ? button.get('label') : 'ENTRAR'}
            primary disabled={button.get('disabled')} />

            {/*<RaisedButton type='submit' label='CRIAR NOVA CONTA' primary />*/}
          </div>
          <CardText>
            Já possui uma conta?
            <Link to={'/login'}> <i className='zmdi zmdi-account' ></i> Logue-se
            </Link>
          </CardText>
        </div>
      </form>
    </Card>
  </Borda>
)

Signup.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  button: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
}

export default Signup
