import { connect } from 'react-redux'
import { 
  onChangeLogin,
  onSubmitLogin
} from "../LoginHome/loginHomeActions"
import {
  onChangeSignup,
  onSubmitSignup
} from "../SignupHome/signupHomeActions"

const mapDispatchToProps = {
  onChangeLogin,
  onSubmitLogin,
  onChangeSignup,
  onSubmitSignup
}

/**
 * @param {Object} state Contem todos os estados
 * @return {Object} Propriedades relacionado ao Home
*/
const mapStateToProps = ({home}) => {
  return {
    login: home.getIn(['home', 'login']),
    signup: home.getIn(['home', 'signup']),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
