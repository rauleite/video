import Auth from '../../modules/Auth'
import { redirectToPrevUrl } from '../../utils/url'
import { sendData } from '../../utils/ajax'
import hello from 'hellojs'

export default (store) => ({
  path: 'logout',
  onEnter: (nextState, replace) => {
    
    hello('facebook').logout().then(() => {
      console.info('hello(facebook).logout()')
    }, (error) => {
      console.error('ERROR: ' + error.error.message);
    })

    const opt = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      },
      method: 'POST'
      // body: JSON.stringify(data)
    }

    sendData('/auth/logout', opt, (error, result) => {
      if (error) {
        console.error('ERRO GRAVE:', error)
        return
      }
      console.log('result', result)
    })

    Auth.deauthenticateUser()
    redirectToPrevUrl()
  }
})
