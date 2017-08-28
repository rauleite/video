import Forgot from "./Forgot"
import { connect } from 'react-redux'
import { changeUser, processForm } from "./forgotActions"
// import { bindActionCreators } from "redux";
// import * as forgotActions from "./forgotActions"
// import * as loginActions from "../Login/loginActions"

const mapDispatchToProps = {
  onSubmit: processForm,
  onChange: changeUser
}

// const mapDispatchToProps = (dispatch) => {
//   console.log('dispatch', dispatch)
//   return {
//     onSubmit: processForm,
//     onChange: bindActionCreators(Object.assign({}, forgotActions, loginActions), dispatch).processForm
//   }
// }

/**
 * @param {Object} state Contem todos os estados
 * @param {Object} ownProps Todas propriedades
 * @return {Object} Propriedades relacionado ao Forgot
*/
const mapStateToProps = ({ forgot }, ownProps) => ({
  errors: forgot.get('errors'),
  successMessage: forgot.get('successMessage'),
  user: forgot.get('user'),
  styles: forgot.get('styles'),
  button: forgot.get('button')
})

export default connect(mapStateToProps, mapDispatchToProps)(Forgot)
