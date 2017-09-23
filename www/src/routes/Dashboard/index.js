import React from 'react'
import Auth from '../../modules/Auth'
import Dashboard from './components/Dashboard'
import { sendForm } from '../Form/formUtils'

class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor (props) {
    super(props)

    this.state = {
      secretData: ''
    }
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount () {
    const options = {
      method : 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    }

    sendForm('/api/dashboard', options, (error, res) => {
      console.log('error', error)
      console.log('res', res)
      
      if (error) {
        localStorage.removeItem('token')
      } else {
        this.setState({
          secretData: res.message
        })
      }
    })
  }

  /**
   * Render the component.
   */
  render () {
    return (<Dashboard secretData={this.state.secretData} />)
  }

}

export default DashboardPage
