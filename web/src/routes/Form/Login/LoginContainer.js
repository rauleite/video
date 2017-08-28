import { connect } from 'react-redux'
import { changeUser, processForm, changeCaptcha } from "./loginActions"
import Login from './Login'

const mapDispatchToProps = {
  onSubmit: processForm,
  onChange: changeUser,
  onChangeCaptcha: changeCaptcha
}

/**
 * @param {Object} state Contem todos os estados
 * @param {Object} ownProps Todas propriedades
 * @return {Object} Propriedades relacionado ao Login
*/
const mapStateToProps = ({ login }, ownProps) => {
  return {
    errors: login.get('errors'),
    successMessage: login.get('successMessage'),
    user: login.get('user'),
    styles: login.get('styles'),
    button: login.get('button'),
    captcha: login.get('captcha')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
// export default connect(mapStateToProps, mapDispatchToProps)
