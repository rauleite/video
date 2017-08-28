import Signup from "./Signup"
import { connect } from 'react-redux'
import { processForm, changeUser } from "./signupActions"

const mapDispatchToProps = {
  onSubmit: processForm,
  onChange: changeUser
}

const mapStateToProps = ({ signup }) => ({
    errors: signup.get('errors'),
    successMessage: signup.get('successMessage'),
    user: signup.get('user'),
    styles: signup.get('styles'),
    button: signup.get('button'),
    userSignupHome: signup.get('userSignupHome')
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
