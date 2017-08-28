import express from 'express'
import { isEmpty } from 'lodash'
import {
  passwordFormValidate,
  passwordAndConfirmePasswordMatchValidate 
} from '../../utils'

const User = require('mongoose').model('User')
const router = new express.Router()

router.get('/:token', (req, res) => {
  (async () => {
    try {
      if (!req.params.token) {
        throw new Error('Erro Interno')
      }

      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      })

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'A solicitação de alteração de senha expirou, favor solicitar novamente.',
          user: {
            token: req.params.token
          }
        })
      }

      const { name, email } = user.toObject()

      return res.status(200).json({
        success: true,
        message: 'Sucesso para aleração da senha.',
        user: {
          name,
          email,
          token: req.params.token
        }
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Erro Interno'
      })
    }
  })()
})

router.post('/', (req, res, next) => {
  if (!hasCorrectResetBody(req.body)) {
    console.error('ERRO GRAVE: request body enviado errado')
    return res.status(400).json({
      success: false,
      message: 'Erro no formulário. Favor preencher corretamente.'
    })
  }

  const validationResult = validateResetForm(req.body)

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }

  (async () => {
    try {
      const passwordToken = req.body.passwordToken ? req.body.passwordToken : undefined

      console.log('passwordToken', passwordToken)
      console.log('Date.now()', Date.now())

      if (!passwordToken) {
        return res.status(400).json({
          success: false,
          message: 'A solicitação de alteração de senha expirou, favor solicitar novamente.'
        })
      }
      console.log('1')

      const user = await User.findOne({
        resetPasswordToken: passwordToken,
        resetPasswordExpires: { $gt: Date.now() }
      })

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'A solicitação de alteração de senha expirou, favor solicitar novamente.'
        })
      }

      user.password = req.body.password
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined

      await user.save()

      const { name, email } = user.toObject()

      // return doLogin(req, res, next)

      return res.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso, use a nova senha para se logar.',
        data: { name, email }
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Erro Interno'
      })
    }
  })()
})

/**
 * Validate the login form
 *
 * @param {object} body - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateResetForm (body) {
  const errors = {}
  let isFormValid = true
  let message = ''

  isFormValid = (
    passwordFormValidate(body, errors) &&
    passwordAndConfirmePasswordMatchValidate(body, errors)
  )

  if (!isFormValid) {
    message = 'Ops, Ocorreu algum erro.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

function hasCorrectResetBody (body) {
  return (
    !isEmpty(body) &&
    !isEmpty(body.email) &&
    !isEmpty(body.password) &&
    !isEmpty(body.confirmePassword) &&
    !isEmpty(body.passwordToken) &&
    !isEmpty(body.token) &&
    typeof body === 'object' &&
    typeof body.email === 'string' &&
    typeof body.password === 'string' &&
    typeof body.confirmePassword === 'string' &&
    typeof body.passwordToken === 'string' &&
    typeof body.token === 'string'
  )
}

export default router
// module.exports = router
