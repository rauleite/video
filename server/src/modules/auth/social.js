import express from 'express'
import passportSync from 'passport'
import { promisifyAll, promisify } from 'bluebird'
import { isEmpty } from 'lodash'
import config from '../../../config/project.config'
import { downloadFileAsync, PATHS } from '../../utils'
import { getHeaderToken } from '../../utils'
import { facebookAsync } from '../../strategies/utils-auth'

const User = promisifyAll(require('mongoose').model('User'))
const request = promisify(require('request'))

const router = new express.Router()

router.post('/', async (req, res) => {
  console.log('POST /social req -->', req.body)
  if (!hasCorrectSocialBody(req.body)) {
    console.error('ERRO GRAVE: request body enviado errado')
    return res.status(400).json({
      success: false,
      message: 'Erro no formulário. Favor preencher corretamente.'
    })
  }
  // Grab the social network and token
  var network = req.body.network
  var socialToken = req.body.socialToken

  // Validate the social token with Facebook
  const authFB = await validateWithProvider(req, res, network, socialToken)

  try {
    // Return the user data we got from Facebook
    console.log('authFB -->', authFB)

    if (authFB.token) {
      return resultSendSocial(req, res, '200', {
        success: true,
        message: 'Autenticado via Facebook, com sucesso!',
        user: authFB.userData,
        token: authFB.token
      })
    } else {
      return resultSendSocial(req, res, '400', {
        success: false,
        message: 'Não autenticou - Facebook!',
        user: authFB.userData,
        errors: null
      })
    }


  } catch(error) {
    console.error('ERRO GRAVE 1', error)
    console.error('ERRO GRAVE 2', profile.error.message)
    return resultSendSocial(req, res, '400', {
      success: false,
      message: 'Falha na Autenticacao via Facebook!',
      user: authFB.userData
    })
  }
})

async function validateWithProvider (req, res, network, socialToken) {
  console.log('validateWithProvider()')
  const photoSize = 200
  const fields = [
    'id',
    'email',
    'first_name',
    'last_name',
    'link',
    'name',
    `picture.width(${photoSize}).height(${photoSize})`
  ]
  const providers = {
    facebook: {
      // graphApiUrl: 'https://graph.facebook.com/me',
      // accessTokenUrl: 'https://graph.facebook.com/v2.5/oauth/access_token',
      graphApiUrl: 'https://graph.facebook.com/v2.9/me',
      params: {
        access_token: socialToken,
        fields: fields.join(',')
        // code: req.body.code,
        // client_id: req.body.clientId,
        // client_secret: config.facebook_secret,
        // redirect_uri: req.body.redirectUri || null
      }
    }
  }

  try {
    const resFB = await request({
      uri: providers[network].graphApiUrl,
      qs: providers[network].params
    })
    const profile = JSON.parse(resFB.body)

    const userData = {
      name: null,
      email: null
    }

    if (resFB.statusCode !== 200) {
      console.log('ERRO FACE: statusCode', resFB.statusCode)
      if (resFB.error) console.log('ERRO FACE: social.error', resFB.error)
      return userData
    }

    /* Verificação server-side */
    if (getHeaderToken(req)) {
      console.info('JÁ está autenticado')
      return userData
    }

    /* Retorna usuario existente, ou cria um. */
    let user = await User.findOneAsync({
      $or: [
        { facebookId: profile.id },
        { email: profile.email }
      ]
    })

    if (!user) {
      console.log('NÃO existia usuario')
      user = new User()
    } else {
      console.log('JÁ existia usuario')
    }

    const userLogin = await salvaNovasProps(user, profile)
    console.log('userLogin', userLogin)
    const token = await facebookAsync(userLogin)
    console.log('token', token)
    userData.name = user.name
    userData.email = user.email
    userData.token = token
  
    return userData
  } catch(error) {
    console.error('ERRO GRAVE:', error)
    return null
  }
}

function resultSendSocial(req, res, status, respObj) {
  return res.status(status).json(respObj)
}

function hasCorrectSocialBody (body) {
  return (
    !isEmpty(body) &&
    !isEmpty(body.network) &&
    !isEmpty(body.socialToken) &&
    typeof body === 'object' &&
    typeof body.network === 'string' &&
    typeof body.socialToken === 'string'
  )
}
/**
 * Atribui dados do Facebook caso ainda não existam no usuário
 * @param {object} user usuario cadastrado
 * @param {object} profile facebook api object
 */
async function salvaNovasProps(user, profile) {
  let precisaSalvarUser = false

  if (!user.name) {
    console.log('user.name -->', profile.name)
    user.name = profile.name
    precisaSalvarUser = true
  }

  if (!user.email) {
    console.log('user.email -->', profile.email)
    user.email = profile.email
    precisaSalvarUser = true
  }
  if (!user.facebookEmail) {
    console.log('user.facebookEmail -->', profile.email)
    // user.facebookEmail = `${profile.email}_`
    user.facebookEmail = profile.email
    precisaSalvarUser = true
  }
  if (!user.facebookId) {
    console.log('user.facebookId -->', profile.id)
    user.facebookId = profile.id
    precisaSalvarUser = true
  }
  if (!user.facebookLink) {
    console.log('user.facebookLink -->', profile.link)
    user.facebookLink = profile.link
    precisaSalvarUser = true
  }

  if (!user.photo) {
    const picData = profile.picture.data

    if (picData && picData.url) {
      console.log('1')
      
      await downloadFileAsync(
        picData.url,
        PATHS.user_profile.dir,
        `${user._id}.jpg`
      )
      console.log('3')
      
      user.photo = `${user._id}.jpg`
      precisaSalvarUser = true
    }
  }
  if (precisaSalvarUser) {
    console.log('Salvando...')
    // const userModel = promisifyAll(user.save.bind(user))
    return await user.saveAsync()
  }
  return user
}

export default router
