import Reset from "./Reset"
import { connect } from 'react-redux'
import { processForm, changeUser } from "./resetActions"

const mapDispatchToProps = {
  onSubmit: processForm,
  onChange: changeUser
}

const mapStateToProps = ({ reset }) => ({
  errors: reset.get('errors'),
  user: reset.get('user'),
  successMessage: reset.get('successMessage'),
  success: reset.get('success'),
  token: reset.get('token'),
  styles: reset.get('styles'),
  button: reset.get('button')
})

export default connect(mapStateToProps, mapDispatchToProps)(Reset)
