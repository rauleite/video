import mongoose from 'mongoose'
import { promisifyAll } from 'bluebird'
const bcrypt = require('bcrypt')
// const bcrypt = promisifyAll(require('bcrypt-nodejs'))

// define the User model schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hasCaptchaComponent: Boolean,
  name: String,
  validToken: String,
  validTokenExpires: Number,
  facebookId: String,
  facebookLink: String,
  facebookEmail: String,
  photo: String
})

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = async function (password) {
  console.log('local-login password', password, 'this', this, this.password)

  // TODO:
  // IF this.password === undefined
  // AND loop (social networks).id === not empty
  // SO Warning: Você escolheu fazer login pelo facebook
  // porém pode criar uma senha a qualquer momento e efetuar
  // o login através destas duas opções

  try {
    const bcryptResult = await bcrypt.compareSync(password, this.password)
    console.log('local-login password2', password)
    return bcryptResult
  } catch (error) {
    console.error('ERRO GRAVE:', error)
    return false
  }
}

// UserSchema.methods.comparePassword = function (password) {
//   console.log('local-login password', password, 'this', this, this.password)
//   const bcryptResult = bcrypt.compare(password, this.password)
//   console.log('local-login password2', password)
//   return bcryptResult
// }

/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook (next) {
  const user = this

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next()

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError)
    }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError)
      }

      // replace a password string with hash value
      user.password = hash

      return next()
    })
  })
})

module.exports = mongoose.model('User', UserSchema)
