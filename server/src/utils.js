import { promisifyAll, promisify } from 'bluebird'
import jwt from 'jsonwebtoken'
import config from '../config/project.config'
import mongoose from 'mongoose'
import https from 'https'
import fs from 'fs-extra'

/* Promisify some methods */
const User = promisifyAll(require('mongoose').model('User'))
const verifyJwt = promisifyAll(jwt.verify)
// const findById = promisifyAll(User.findById.bind(User))

export const PATHS = {
  user_profile: {
    dir: `/home/${require("os").userInfo().username}/user_profile/picture`
  }
}

/**
 * Altera o objeto errors adicionando mensagem a propriedade name
 * @param {object} user
 * @param {object} errors
 */
export function nameFormValidate (user, errors) {
  console.log('nameFormValidate()')
  if (!validateName(user.name)) {
    console.error('ERRO GRAVE: Email vazio')
    errors.name = 'Erro no formulário. Preencha corretamente.'
    return false
  }
  return true
}

/**
 * Altera o objeto errors adicionando mensagem a propriedade email
 * @param {object} user
 * @param {object} errors
 */
export function emailFormValidate (user, errors) {
  console.log('emailFormValidate()')
  if (user.email.length === 0) {
    console.error('ERRO GRAVE: Email vazio')
    errors.email = 'Erro no formulário. Preencha corretamente.'
    return false
  }

  if (!validateEmail(user.email)) {
    console.error('ERRO GRAVE: Email não validado')
    errors.email = 'Erro no formulário. Preencha corretamente.'
    return false
  }

  return true
}

/**
 * Altera o objeto errors adicionando mensagem a propriedade email
 * @param {object} payload
 * @param {object} errors
 */
export function passwordFormValidate (body, errors) {
  console.log('passwordFormValidate()')
  if (body.password.length < 8) {
    console.error('ERRO GRAVE: A senha deve ter pelo menos 8 dígitos.')
    errors.password = 'Erro no formulário. Preencha corretamente.'
    return false
  }

  if (!validatePassword(body.password)) {
    console.error('ERRO GRAVE: Senha não validada')
    errors.password = 'Erro no formulário. Preencha corretamente.'
    return false
  }

  return true
}

/**
 * Is password and confirmePassword matches?
 * @param {string} password
 * @param {string} confirmePassword 
 */
export function passwordAndConfirmePasswordMatchValidate (body, errors) {
  console.log('passwordAndConfirmePasswordMatchValidate()')
  if (body.password !== body.confirmePassword) {
    console.error('ERRO GRAVE: Senha e confirmação não batem')
    errors.password = 'Erro no formulário. Preencha corretamente.'
    return false
  }
  return true
}

/**
 * Mínimo tem que ser 2 nomes com 2 digitos (eg. 'Ab Cd')
 * @param {string} name
 */
function validateName (name) {
  if (name) {
    name = name.trim()
    const names = name.split(' ')
    return names.length >= 2 && names[0].length >= 2 && names[1].length >= 2
  } else {
    return false
  }
}

/**
 * Valida o email
 * @param {string} email email em questão
 */
export function validateEmail (email) {
  var re = new RegExp([
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|',
    '(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|',
    '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
  ].join(''))
  return re.test(email)
}

/**
 * Valida o password
 * @param {string} password senha em questão
 */
function validatePassword (password) {
  var re = /\s/
  return !re.test(password)
}

/**
 * Retorna o token contido no header, se existir
 * @param {object} req http req
 */
export function getHeaderToken (req) {
  return req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
}

/**
 * Verifica se está autenticado
 * @param {string} token authentication token
 */
export async function verifyAuthentication (token) {
  try {
    const decoded = await verifyJwt(token, config.jwt_secret)
    console.log('decoded', decoded)
    const userId = decoded.sub

    // check if a user exists
    const user = await User.findById(userId)
    const dateNow = getDateNowFormartNormalizer()

    if (!user || user.validToken !== token) {
      console.log('Não teve autorização, deve retornar STATUS 401')
      return null
    }

    /* Defensive block. Never should be enter in this if */
    if (dateNow > user.validTokenExpires) {
      try {
        addBlankValidToken(user)
        throw new Error('Esse ponto soh um Defensive block')
      } catch (error) {
        console.error('ERRO GRAVE', error)
      }
      return null
    }

    console.log('B')
    return user
  } catch (error) {
    console.log('ERRO GRAVE:', error)
    return null
  }
}

/**
 * Persiste string vazia no atributo de usuario, para invalidar qualquer token
 * @param {object} user
 */
export async function addBlankValidToken (user) {
  const save = promisify(user.save.bind(user))
  try {
    user.validToken = ''
    user.validTokenExpires = 0
    return await save()
  } catch (error) {
    console.error('ERRO GRAVE:', error)
    return null
  }
}

/**
 * Zera o atributo validToken. Orquestra a verificacao de auth e adiciona blankValidToken
 * @param {string} token
 */
export async function zeraValidToken (token) {
  const user = await verifyAuthentication(token)
  if (!user) {
    console.log('sem usuario no retorno do verifyAuthentication()')
    return null
  }
  return addBlankValidToken(user, (error, user) => {
    if (error) console.error('ERRO GRAVE:', error)
    return user
  })
}

/**
 * Return Date now in seconds, like jwt expires format
 * @param {number} timeExpires optional - plus in timeExpires
 */
export function getDateNowFormartNormalizer (timeExpires = 0) {
  /* divides by 1000 to make format like jwt.exp seconds format */
  return Math.round((Date.now() / 1000) + (timeExpires))
}

/**
 * Download Web File
 * @param {string} url url para download
 * @param {string} destDir nome do diretorio de destino no sistema
 * @param {string} destFile nome do arquivo de destino
 * @param {function} cb callback
 */
export async function downloadFile (url, destDir, destFile, cb) {
  try {
    await createDir(destDir)
  } catch (error) {
    console.log('ERRO GRAVE:', error)
  }
  let file = fs.createWriteStream(`${destDir}/${destFile}`)
  
  let request = https.get(url, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      /* close() is async, call cb after close completes. */
      file.close(cb)
    })
  }).on('error', (error) => {
    /* Delete the file async. (But we don't check the result) */
    fs.unlink(dest)
    if (cb) cb(error);
  })
}

export const downloadFileAsync = promisify(downloadFile)

async function createDir (destDir, cb) {
  const ensure = await fs.ensureDir(destDir)
}
