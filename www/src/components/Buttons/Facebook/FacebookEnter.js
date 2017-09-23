import React from 'react'
import hello from 'hellojs'
// import '../../../styles/icons/scss/material-design-iconic-font.css'
import FacebookButton from '../../../components/Buttons/FacebookButton'
// import RaisedButton from 'material-ui/RaisedButton'
import { sendForm } from './../../../utils/formUtils'
import { redirectToPrevUrl } from '../../../utils/url'
import Auth from '../../../modules/Auth'

export const Facebook = (props) => (
  <FacebookButton onClick={ onclick } >{props.children}</FacebookButton>
)

function onclick () {
  console.log('clicou')
  hello('facebook').login({ scope:'email' })
}

var socialToken

const sessionStart = (auth) => {
  console.log('sessionStart')
  console.log('hello.on auth', auth)
  const token = Auth.getToken()
  if (token) {
    console.info('Já está autenticado, não vai bater no server - facebook')
    return
  }
  /* Call user information, for the given network */

  // hello(auth.network).api('/me').then(function (r) {

  // console.log('hello(auth.network).api(/me).then() --> r', r)

  /* Save the social token */
  console.log('auth.authResponse', auth.authResponse)
  socialToken = auth.authResponse.access_token
  console.log('socialToken', socialToken)

  /* Auth with our own server using the social token */
  authenticate(auth.network, socialToken, token)
    .then(function (res) {
      console.log('Autenticando...')
      Auth.authenticateUser(res.token)
      redirectToPrevUrl()
  })
}

hello.on('auth.login', sessionStart)
// hello.off('auth.login', sessionStart)

hello.off('auth.login', () => {
  console.log('hello.off()')
  hello('facebook').logout().then(() => {
    console.info('Signed out');
  }, (error) => {
    console.info('Signed out error: ' + error.error.message);
  })
  // return sessionStart
})

hello.init({
  facebook: '1664340757147626'
  // windows: WINDOWS_CLIENT_ID,
  // google: GOOGLE_CLIENT_ID
}
// ,
// {
//   redirect_uri: 'static/redirect.html'
//   // redirect_uri: localStorage.getItem('urlPrevLogin')
// }
)
function authenticate (network, socialToken, token) {
  return new Promise((resolve, reject) => {
    const data = {
      body: {
        network,
        socialToken
      }
    }

    if (token) {
      data.headers = {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      }
    }

    sendForm(
      '/auth/social',
      data,
      (error, res) => {
        if (error) {
          reject(error)
        } else {
          resolve(res)
        }

    })
  })
}

// Facebook.propTypes = {
// }

export default Facebook
