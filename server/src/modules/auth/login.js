import express from 'express'
import passportSync from 'passport'
import request from 'request-promise'
import redisClient from '../../connect/redis-connect'
import { isEmpty } from 'lodash'
import { promisifyAll } from 'bluebird'

import {
  emailFormValidate,
  passwordFormValidate
} from '../../utils'

import projectConfig from '../../../config/project.config'

const passport = promisifyAll(passportSync)
const router = new express.Router()

router.post('/', async (req, res, next) => {
  // doLogin(req, res, next)
  // console.log('req.connection.remoteAddress', req.connection.remoteAddress)
  // console.log('req.headers.x-forwarded-for', req.headers['x-forwarded-for'])
  // console.log('req.headers.x-real-ip', req.headers['x-real-ip'])
  // console.log('req.ip', req.ip)
  // console.log('req.ips', req.ips)
  console.log('--> auth/login', req.body)
  try {
    if (!hasCorrectLoginBody(req.body)) {
      console.error('ERRO GRAVE: request body enviado errado')
      return res.status(400).json({
        success: false,
        message: 'Erro no formulário. Favor preencher corretamente.'
      })
    }
    const captchaValue = req.body.captchaValue
    const validation = validateLoginForm(req.body)

    if (!validation.success) {
      return resultSend(req, res, '400', {
        success: false,
        message: validation.message,
        errors: validation.errors
      })
    }

    let hasCaptcha = await redisClient.hmgetAsync(req.body.email, 'hasCaptcha')
    /* retorno vem null ou string representando true ou false */
    hasCaptcha = hasCaptcha[0]
    hasCaptcha = hasCaptcha === 'true'

    /* Se nao ha captcha retorna null, quando ha retorna string do boolean */
    if (hasCaptcha) {
      console.log('ha captcha no redis')

      /* Se ha captcha mas browser nao preencheu */
      if (isEmpty(captchaValue)) {
        console.log('NAO foi preenchido pelo browser')

        return resultSend(req, res, '400', {
          success: false,
          message: 'O captcha precisa ser preenchido',
          errors: {
            captcha: 'O captcha precisa ser preenchido'
          }
        })
      }
      console.log('FOI preenchido pelo browser')

      /* Se ha captcha e browser preencheu-o */
      const secretKey = projectConfig.captcha_secret
      let remoteIP = req.connection.remoteAddress.split(':')
      remoteIP = remoteIP[remoteIP.length - 1]

      let verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey +
        '&response=' + captchaValue +
        '&remoteip=' + remoteIP

      let responseCaptcha = await request(verificationUrl)

      responseCaptcha = JSON.parse(responseCaptcha)
      console.log('responseCaptcha', responseCaptcha)

      if (!responseCaptcha.success) {
        return resultSend(req, res, '400', {
          success: false,
          message: 'Erro na verificação do captcha',
          errors: {
            captcha: 'Erro na verificação do captcha'
          }
        })
      }
    }
  } catch (error) {
    console.log('error', error)
  }

  passport.authenticate('local-login', (error, token, userData) => {
    console.log('error', error)
    console.log('token', token)
    console.log('userData', userData)

    if (error) {
      if (error.name === 'IncorrectCredentialsError') {
        return resultSend(req, res, '400', {
          success: false,
          message: error.message
        })
      }

      return resultSend(req, res, '400', {
        success: false,
        message: 'Não foi possível processar o formulário.'
      })
    } else if (!userData) {
      // Em tese nunca cai aqui
      return resultSend(req, res, '400', {
        success: false,
        message: 'Não foi possível processar o formulário.'
      })
    }

    return resultSend(req, res, '200', {
      success: true,
      message: 'Você efetuou o login, com sucesso!',
      token,
      user: userData
    })
  })(req, res, next)
})

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm (user) {
  const errors = {}
  let isFormValid
  let message = ''

  isFormValid = emailFormValidate(user, errors) && passwordFormValidate(user, errors)

  if (!isFormValid) {
    message = 'Ops, Ocorreu algum erro.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

export async function doLogin (req, res, next) {
  
}

async function resultSend (req, res, status, respObj) {
  try {
    respObj.hasCaptchaComponent = respObj.hasCaptchaComponent || false

    const objCaptcha = {
      email: req.body.email,
      count: 0,
      countExpires: Date.now() + 3600000,
      hasCaptcha: false
    }

    let replyCountExpires = await redisClient.hmgetAsync(req.body.email, 'countExpires')

    replyCountExpires = Number(replyCountExpires)

    console.log('replyCountExpires', replyCountExpires)

    /* Se nao existe, cria novo */
    if (replyCountExpires === 0) {
      const isOk = await redisClient.hmsetAsync(req.body.email, objCaptcha)
      console.log('replyCountExpires cria', isOk)
      console.log('res.json', respObj)
      return res.status(status).json(respObj)
    }
    /* Se expiorado OU Erro no form (eg. senha nao bate) */
    if (replyCountExpires < Date.now() || !respObj.success) {
      console.log('!respObj.success')
      const replyIncrCount = await redisClient.hincrbyAsync(objCaptcha.email, 'count', 1)
      console.log('replyIncrCount', replyIncrCount)

      /* count maior que 2 */
      if (replyIncrCount >= 2) {
        const hasCaptchaOk = await redisClient.hmsetAsync(objCaptcha.email, 'hasCaptcha', true)
        console.log('set hasCaptcha true', hasCaptchaOk)
        respObj.hasCaptchaComponent = true
      }
      console.log('res.json', respObj)
      return res.status(status).json(respObj)
    }

    /* Sucesso no form (senha e login ok) */
    console.log('Tudo ok')
    const delIsOK = await redisClient.del(objCaptcha.email)
    console.log('delIsOK', delIsOK)
    /* Só pra garantir */
    respObj.hasCaptchaComponent = false
    console.log('res.json', respObj)
    return res.status(status).json(respObj)

  /* Só entra aqui se houver erros de modulos */
  } catch (error) {
    console.error('ERRO GRAVE: ', error)
    return
  }
}

function hasCorrectLoginBody (body) {
  return (
    !isEmpty(body) &&
    !isEmpty(body.email) &&
    !isEmpty(body.password) &&
    typeof body === 'object' &&
    typeof body.email === 'string' &&
    typeof body.password === 'string'
  )
}

export default router
// module.exports = router
