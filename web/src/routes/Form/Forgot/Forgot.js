import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Borda from "../../../layouts/Borda/Borda"
import '../../../styles/icons/scss/material-design-iconic-font.css'

const Forgot = ({
  onSubmit,
  onChange,
  errors,
  styles,
  successMessage,
  user,
  button
}) => (
  <Borda>
    <Card >
      <form action='/' onSubmit={onSubmit}>
        <div className='center-xs'>
          <CardTitle
            title={<i className='zmdi zmdi-help zmdi-hc-2x'></i>}
            subtitle='Coloque seu email, pra criar nova senha' />
          { successMessage ? <p className={styles.get('infoMessage')}>{ successMessage }</p> : '' }
          { errors.get('summary') && <p className='error-message'>{ errors.get('summary') }</p> }

          <TextField
            autoFocus
            floatingLabelText='Email'
            name='email'
            onChange={onChange}
            errorText={errors.get('email')}
            value={user.get('email')}
            floatingLabelShrinkStyle={styles.get('email')}
            errorStyle={styles.get('email')}
          />
          <br />
          <br />
          <RaisedButton type='submit' label={button.get('label') ? button.get('label') : 'ENTRAR'}
            primary disabled={button.get('disabled')} />
        </div>
      </form>
      <br />
    </Card>
  </Borda>
)

Forgot.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  button: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}

export default Forgot
