import express from 'express'
import { isEmpty } from 'lodash'
// import validator from 'validator'
import passport from 'passport'
import {
  nameFormValidate,
  emailFormValidate,
  passwordFormValidate
} from '../../utils'

const router = new express.Router()

router.post('/', (req, res, next) => {
  if (!hasCorrectSignupBody(req.body)) {
      console.error('ERRO GRAVE: request body enviado errado')
      return res.status(400).json({
        success: false,
        message: 'Erro no formulário. Favor preencher corretamente.'
      })
    }
  const validationResult = validateSignupForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }

  return passport.authenticate('local-signup', (error) => {
    if (error) {
      console.log('ERROR', error)
      if (error.name === 'MongoError' && error.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Ocorreu algum erro.',
          errors: {
            email: 'Este email já existe, você pode se logar usando-o.'
          }
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Erro interno ao tentar processar o cadastro.'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Seu cadastro foi realizado com sucesso, agora pode fazer o login.'
    })
  })(req, res, next)
})

/**
 * Validate the sign up form
 *
 * @param {object} user - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm (user) {
  const errors = {}
  let isFormValid = true
  let message = ''

  isFormValid = (
    nameFormValidate(user, errors) &&
    emailFormValidate(user, errors) &&
    passwordFormValidate(user, errors)
  )

  if (!isFormValid) {
    message = 'Ops, ocorreu algum equívoco.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

function hasCorrectSignupBody (body) {
  return (
    !isEmpty(body) &&
    !isEmpty(body.name) &&
    !isEmpty(body.email) &&
    !isEmpty(body.password) &&
    typeof body === 'object' &&
    typeof body.name === 'string' &&
    typeof body.email === 'string' &&
    typeof body.password === 'string'
  )
}

// export default router
module.exports = router
