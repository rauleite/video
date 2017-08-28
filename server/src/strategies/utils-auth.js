import jwt from 'jsonwebtoken'
import config from '../../config/project.config'
import { getDateNowFormartNormalizer } from '../utils'
import { promisify, promisifyAll } from 'bluebird'

const User = promisifyAll(require('mongoose').model('User'))

export const facebookAsync = promisify(facebook)

export async function login (email, password, done) {
  const userData = {
    email: email.trim(),
    password: password.trim()
  }

  const user = await User.findOneAsync({ email: userData.email })

  try {
    if (!user) {
      const err = new Error('Você digitou login ou senha errado')
      err.name = 'IncorrectCredentialsError'

      return done(err)
    }
    
    const isMatch = await user.comparePassword(userData.password)
    if (!isMatch) {
      const error = new Error('Você digitou login ou senha errado')
      error.name = 'IncorrectCredentialsError'

      return done(error)
    }

    createToken(user, done)
    // return done(null, token, { name: user.name })
  } catch (error) {
    console.error('ERRO:', error)
  }
}

export function signup (req, email, password, done) {
  const newUser = new User({
    email: email.trim(),
    password: password.trim(),
    name: req.body.name.trim()
  })

  newUser.save((error) => {
    console.log(error)
    if (error) {
      return done(error)
    }

    return done(null)
  })
}

export function facebook (user, done) {
  createToken(user, done)
}

function createToken (user, done) {
  console.log('criando token')
  /* 7 dias (sec, min, hour, day) */
  // const timeExpires = 60 * 60 * 24 * 7
  const timeExpires = 60


  // create a token string
  const token = jwt.sign(
    { sub: user._id },
    config.jwt_secret,
    { expiresIn: timeExpires }
  )

  user.validToken = token
  user.validTokenExpires = getDateNowFormartNormalizer(timeExpires)
  user.save(error => {
    if (error) {
      console.error('ERRO GRAVE: - token.validToken', error)
      done(error)
      return
    }
  })

  done(null, token, { name: user.name })
  return
}
